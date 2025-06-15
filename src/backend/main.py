# src/backend/main.py

from fastapi import FastAPI, HTTPException, Depends, status
from typing import Dict, List, Optional
from backend.schemas import CombinedAnalysisRequest, SymptomData, InitialAnalysisData, CombinedAnalysisResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import math
import os
from supabase import create_client, Client
from dotenv import load_dotenv
import logging
import requests
from jose import jwt
from jose.exceptions import JWTError, ExpiredSignatureError, JWTClaimsError

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# --- Load Environment Variables ---
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path=dotenv_path)

# --- Supabase Client ---
SUPABASE_URL: str = os.environ.get("SUPABASE_URL")
SUPABASE_KEY: str = os.environ.get("SUPABASE_SERVICE_KEY")
supabase: Optional[Client] = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL and SUPABASE_KEY else None

if not supabase:
    logging.error("Supabase client NOT initialized. Check .env variables.")

# --- Auth0 Config ---
AUTH0_DOMAIN = "dev-ocmlehsrb5rrnrxr.us.auth0.com"
API_AUDIENCE = "https://api.peteye.ai" # <<< ใช้ Identifier ใหม่
ALGORITHMS = ["RS256"]

# --- Auth0 Dependency ---
bearer_scheme = HTTPBearer()
JWKS = None
try:
    jwks_url = f"https://{AUTH0_DOMAIN}/.well-known/jwks.json"
    JWKS = requests.get(jwks_url).json()
    logging.info("Successfully fetched JWKS.")
except Exception as e:
    logging.error(f"Failed to fetch JWKS: {e}")

async def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)) -> str:
    token = credentials.credentials
    credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials", headers={"WWW-Authenticate": "Bearer"})
    
    if not JWKS:
        logging.error("JWKS not available for validation.")
        raise credentials_exception

    try:
        unverified_header = jwt.get_unverified_header(token)
        rsa_key = {}
        for key in JWKS["keys"]:
            if key["kid"] == unverified_header["kid"]:
                rsa_key = {"kty": key["kty"], "kid": key["kid"], "use": key["use"], "n": key["n"], "e": key["e"]}
                break
        
        if not rsa_key:
            logging.error("Unable to find appropriate key in JWKS.")
            raise credentials_exception

        payload = jwt.decode(
            token,
            rsa_key,
            algorithms=ALGORITHMS,
            audience=API_AUDIENCE,
            issuer=f"https://dev-ocmlehsrb5rrnrxr.us.auth0.com/" # <<< จุดสำคัญที่แก้ไข!
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        return user_id
    except ExpiredSignatureError:
        logging.warning("Token has expired.")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired")
    except JWTClaimsError as e:
        logging.warning(f"Token claims error: {e}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Invalid claims: {e}")
    except Exception as e:
        logging.error(f"An unexpected error occurred during token validation: {e}", exc_info=True)
        raise credentials_exception

# --- FastAPI App ---
app = FastAPI(title="PetEye AI Backend API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# ... (DISEASE_LIST and SYMPTOM_MAP from your code)

DISEASE_LIST = [
    "Conjunctivitis", "Cataract", "Corneal Ulcer / Keratitis",
    "Glaucoma", "Uveitis", "Dry Eye / KCS",
    "Normal/Clear", "Other/Unknown"
]
SYMPTOM_MAP = {
    "behavior_rubbing_scratching": {"Conjunctivitis": 0.15, "Corneal Ulcer / Keratitis": 0.15, "Dry Eye / KCS": 0.15, "Uveitis": 0.1},
    "behavior_squinting_photophobia": {"Corneal Ulcer / Keratitis": 0.35, "Uveitis": 0.35, "Glaucoma": 0.2, "Conjunctivitis": 0.1, "Dry Eye / KCS": 0.1},
    "behavior_light_avoidance": {"Uveitis": 0.25, "Corneal Ulcer / Keratitis": 0.15},
    "behavior_vision_loss_bumping": {"Cataract": 0.4, "Glaucoma": 0.4, "Uveitis": 0.25, "Other/Unknown": 0.1, "Normal/Clear": -0.5},
    "behavior_startle_easily": {"Glaucoma": 0.1, "Cataract": 0.1, "Uveitis": 0.1},
    "behavior_lethargy_activity_decrease": {"Uveitis": 0.1, "Glaucoma": 0.05, "Systemic Link": 0.15},
    "behavior_appetite_decrease": {"Uveitis": 0.1, "Glaucoma": 0.05, "Systemic Link": 0.15},
    "eye_direct_discharge_tearing_clear": {"Conjunctivitis": 0.15, "Dry Eye / KCS": 0.1, "Corneal Ulcer / Keratitis": 0.05, "Normal/Clear": -0.1},
    "eye_direct_discharge_type_mucoid": {"Conjunctivitis": 0.25, "Dry Eye / KCS": 0.2, "Normal/Clear": -0.2},
    "eye_direct_discharge_type_purulent": {"Conjunctivitis": 0.5, "Corneal Ulcer / Keratitis": 0.4, "Dry Eye / KCS": 0.25, "Normal/Clear": -0.6},
    "eye_direct_discharge_type_bloody": {"Corneal Ulcer / Keratitis": 0.3, "Glaucoma": 0.1, "Uveitis": 0.2, "Other/Unknown": 0.3, "Normal/Clear": -0.7},
    "eye_direct_discharge_type_brownish": {"Normal/Clear": 0.05},
    "eye_direct_discharge_amount_medium": {"Conjunctivitis": 0.1, "Corneal Ulcer / Keratitis": 0.1, "Dry Eye / KCS": 0.1},
    "eye_direct_discharge_amount_high": {"Conjunctivitis": 0.2, "Corneal Ulcer / Keratitis": 0.2, "Dry Eye / KCS": 0.2, "Normal/Clear": -0.2},
    "eye_direct_redness_sclera_conjunctiva": {"Conjunctivitis": 0.4, "Corneal Ulcer / Keratitis": 0.3, "Uveitis": 0.4, "Glaucoma": 0.3, "Dry Eye / KCS": 0.25, "Normal/Clear": -0.3},
    "eye_direct_redness_inner_eyelid": {"Conjunctivitis": 0.25, "Dry Eye / KCS": 0.15},
    "eye_direct_cornea_opacity_hazy_white": {"Corneal Ulcer / Keratitis": 0.6, "Uveitis": 0.4, "Glaucoma": 0.1, "Cataract": -0.3, "Conjunctivitis": -0.2, "Normal/Clear": -0.8},
    "eye_direct_cornea_opacity_blueish": {"Corneal Ulcer / Keratitis": 0.5, "Uveitis": 0.3, "Glaucoma": 0.2, "Normal/Clear": -0.7},
    "eye_direct_cornea_ulcer_scratch": {"Corneal Ulcer / Keratitis": 0.8},
    "eye_direct_cornea_blood_vessels": {"Corneal Ulcer / Keratitis": 0.3, "Uveitis": 0.2, "Dry Eye / KCS": 0.2},
    "eye_direct_pupil_size_small": {"Uveitis": 0.7, "Corneal Ulcer / Keratitis": 0.15, "Glaucoma": -0.4, "Normal/Clear": -0.6},
    "eye_direct_pupil_size_large": {"Glaucoma": 0.7, "Cataract": 0.05, "Uveitis": -0.3, "Normal/Clear": -0.6},
    "eye_direct_pupil_size_unequal": {"Glaucoma": 0.5, "Uveitis": 0.3, "Other/Unknown": 0.3, "Normal/Clear": -0.7},
    "eye_direct_eyelid_swelling": {"Conjunctivitis": 0.2, "Corneal Ulcer / Keratitis": 0.1, "Other/Unknown": 0.15},
    "eye_direct_eyelid_incomplete_closure": {"Dry Eye / KCS": 0.25, "Other/Unknown": 0.1},
    "eye_direct_third_eyelid_protruding": {"Conjunctivitis": 0.1, "Uveitis": 0.2, "Dry Eye / KCS": 0.15, "Other/Unknown": 0.1},
    "eye_direct_eyelid_mass_lump": {"Other/Unknown": 0.6},
    "eye_direct_lens_opacity_cataract": {"Cataract": 0.9, "Normal/Clear": -0.7, "Glaucoma": -0.1, "Uveitis": -0.1, "Conjunctivitis": -0.2, "Corneal Ulcer / Keratitis": -0.2, "Dry Eye / KCS": -0.1},
    "eye_direct_hyphema_blood_in_eye": {"Uveitis": 0.4, "Glaucoma": 0.1, "Other/Unknown": 0.5, "Normal/Clear": -0.9},
    "eye_direct_nystagmus_eye_shaking": {"Other/Unknown": 0.6, "Normal/Clear": -0.5},
    "eye_around_periorbital_redness_inflammation": {"Conjunctivitis": 0.1, "Dry Eye / KCS": 0.1},
    "eye_around_periorbital_wounds_scratches": {"Other/Unknown": 0.2},
    "eye_around_periorbital_hair_loss": {"Dry Eye / KCS": 0.15, "Other/Unknown": 0.1},
    "systemic_weight_loss": {"Systemic Link": 0.2},
    "systemic_increased_thirst_urination": {"Systemic Link": 0.3},
    "systemic_fever": {"Systemic Link": 0.25, "Uveitis": 0.1},
    "systemic_vomiting_diarrhea": {"Systemic Link": 0.1},
    "systemic_jaundice": {"Systemic Link": 0.4, "Uveitis": 0.15},
    "systemic_neurologic_signs": {"Other/Unknown": 0.4},
    "systemic_other_skin_ear_issues": {"Systemic Link": 0.1}
}


@app.get("/")
async def read_root():
    return {"message": "Welcome to PetEye AI Backend!"}

@app.get("/history")
async def get_history(current_user_id: str = Depends(get_current_user_id)):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase client not initialized")
    try:
        logging.info(f"Fetching history for user: {current_user_id}")
        select_result = supabase.table("analysis_history").select("*").eq("user_id", current_user_id).order("analysis_timestamp", desc=True).limit(20).execute()
        return {"history": select_result.data}
    except Exception as e:
        logging.error(f"Failed to fetch history from Supabase: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to fetch analysis history")

@app.post("/analyze/combined", response_model=CombinedAnalysisResponse)
async def analyze_combined_endpoint(request_data: CombinedAnalysisRequest, current_user_id: str = Depends(get_current_user_id)):
    # ... (Your full analysis logic remains here) ...
    # This is a simplified placeholder for your complex logic
    initial_analysis = request_data.initial_analysis_data
    symptoms_obj = request_data.symptoms
    
    # Placeholder response generation
    likely_diagnosis = "Cataract"
    confidence_level = "Medium"
    final_score = 0.75
    normalized_scores = {"Cataract": 0.75, "Normal/Clear": 0.1}
    key_symptoms_found = [key for key, value in symptoms_obj.dict().items() if value]
    recommendations = ["Consult a veterinarian for surgical options."]
    warnings = ["Vision may progressively worsen."]
    
    final_response = CombinedAnalysisResponse(
        likely_diagnosis=likely_diagnosis,
        confidence_level=confidence_level,
        raw_score=final_score,
        possible_diseases_scores=normalized_scores,
        key_symptoms_found=key_symptoms_found,
        recommendations=recommendations,
        warnings=warnings,
        disclaimer="This is a preliminary analysis. Always consult a certified veterinarian."
    )
    
    # --- Database Insert Logic ---
    if supabase:
        try:
            pet_type_guess = initial_analysis.analysisId.split('_')[0] if '_' in initial_analysis.analysisId else "Unknown"
            data_to_insert = {
                "user_id": current_user_id,
                "pet_type": pet_type_guess,
                "selected_symptoms": symptoms_obj.dict(),
                "likely_diagnosis": final_response.likely_diagnosis,
                "confidence_level": final_response.confidence_level,
                "raw_score": final_response.raw_score,
                "recommendations": final_response.recommendations,
                "warnings": final_response.warnings,
                "possible_diseases_scores": final_response.possible_diseases_scores,
                "key_symptoms_found": final_response.key_symptoms_found,
                "initial_disease_prediction": initial_analysis.initialDisease,
                "initial_confidence_prediction": initial_analysis.initialConfidence
            }
            logging.info(f"Attempting to insert history for user: {current_user_id}")
            supabase.table("analysis_history").insert(data_to_insert).execute()
        except Exception as e:
            logging.error(f"Exception during Supabase insert: {e}", exc_info=True)
            # Do not re-raise, just log the error and continue
    
    return final_response