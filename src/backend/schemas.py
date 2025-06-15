# src/backend/schemas.py
from pydantic import BaseModel, Field
from typing import Optional, List, Dict

class SymptomData(BaseModel):
    behavior_rubbing_scratching: bool
    behavior_squinting_photophobia: bool
    behavior_light_avoidance: bool
    behavior_vision_loss_bumping: bool
    behavior_startle_easily: bool
    behavior_lethargy_activity_decrease: bool
    behavior_appetite_decrease: bool
    eye_direct_discharge_none_mild: bool
    eye_direct_discharge_tearing_clear: bool
    eye_direct_discharge_type_mucoid: bool
    eye_direct_discharge_type_purulent: bool
    eye_direct_discharge_type_bloody: bool
    eye_direct_discharge_type_brownish: bool
    eye_direct_discharge_amount_low: bool
    eye_direct_discharge_amount_medium: bool
    eye_direct_discharge_amount_high: bool
    eye_direct_redness_sclera_conjunctiva: bool
    eye_direct_redness_inner_eyelid: bool
    eye_direct_cornea_opacity_hazy_white: bool
    eye_direct_cornea_opacity_blueish: bool
    eye_direct_cornea_ulcer_scratch: bool
    eye_direct_cornea_blood_vessels: bool
    eye_direct_pupil_size_small: bool
    eye_direct_pupil_size_large: bool
    eye_direct_pupil_size_unequal: bool
    eye_direct_eyelid_swelling: bool
    eye_direct_eyelid_incomplete_closure: bool
    eye_direct_third_eyelid_protruding: bool
    eye_direct_eyelid_mass_lump: bool
    eye_direct_lens_opacity_cataract: bool
    eye_direct_hyphema_blood_in_eye: bool
    eye_direct_nystagmus_eye_shaking: bool
    eye_around_periorbital_redness_inflammation: bool
    eye_around_periorbital_wounds_scratches: bool
    eye_around_periorbital_hair_loss: bool
    systemic_weight_loss: bool
    systemic_increased_thirst_urination: bool
    systemic_fever: bool
    systemic_vomiting_diarrhea: bool
    systemic_jaundice: bool
    systemic_neurologic_signs: bool
    systemic_other_skin_ear_issues: bool

class InitialAnalysisData(BaseModel):
    analysisId: str
    initialDisease: Optional[str] = None
    initialConfidence: Optional[float] = Field(None, ge=0.0, le=1.0)

class CombinedAnalysisRequest(BaseModel):
    initial_analysis_data: InitialAnalysisData
    symptoms: SymptomData

class CombinedAnalysisResponse(BaseModel):
    likely_diagnosis: str
    confidence_level: str # เช่น 'High', 'Medium', 'Low', 'Very Low'
    raw_score: float
    possible_diseases_scores: Dict[str, float]
    key_symptoms_found: List[str]
    recommendations: List[str]
    warnings: List[str]
    disclaimer: str