// src/components/SymptomChecklist.js
import React, { useState } from 'react';

// --- โครงสร้างข้อมูลสำหรับรายการอาการฉบับละเอียด (เหมือนเดิม) ---
const detailedSymptomConfig = [
    { category: 'พฤติกรรมและการมองเห็นที่เปลี่ยนไป', keyPrefix: 'behavior', items: [ /* ... รายการอาการ ... */ ] },
    { category: 'ลักษณะผิดปกติที่ดวงตาโดยตรง', keyPrefix: 'eye_direct', items: [ /* ... รายการอาการ ... */ ] },
    { category: 'ลักษณะผิดปกติรอบดวงตา', keyPrefix: 'eye_around', items: [ /* ... รายการอาการ ... */ ] },
    { category: 'อาการทางระบบอื่นๆ ที่อาจเกี่ยวข้อง', keyPrefix: 'systemic', items: [ /* ... รายการอาการ ... */ ] }
];
// (ใส่ items ให้ครบถ้วนจากโค้ดก่อนหน้านี้)
// --- ตัวอย่าง items สำหรับหมวด 'พฤติกรรม...' ---
detailedSymptomConfig[0].items = [
    { key: 'rubbing_scratching', label: 'ขยี้ตา / เกาตา / เอาหน้าถูไถ' },
    { key: 'squinting_photophobia', label: 'หรี่ตา / ตาหยี / กระพริบตาถี่ (บ่งชี้ความเจ็บปวด/ระคายเคือง)' },
    { key: 'light_avoidance', label: 'กลัวแสง / หลบแสง / อยู่แต่ในที่มืด' },
    { key: 'vision_loss_bumping', label: 'การมองเห็นลดลง (เดินชนของ, หาของไม่เจอ, ดูลังเลเวลาเดิน)' },
    { key: 'startle_easily', label: 'ตกใจง่ายเมื่อเข้าใกล้ (อาจเกิดจากมองไม่เห็น)' },
    { key: 'lethargy_activity_decrease', label: 'ซึม / ไม่ร่าเริง / กิจกรรมลดลง' },
    { key: 'appetite_decrease', label: 'เบื่ออาหาร / กินอาหารลดลง' }
];
// --- ตัวอย่าง items สำหรับหมวด 'ลักษณะผิดปกติที่ดวงตาโดยตรง' ---
detailedSymptomConfig[1].items = [
    { subCategory: 'สารคัดหลั่ง / ขี้ตา', key: 'discharge_none_mild', label: 'ไม่มีขี้ตา หรือ มีเล็กน้อย (ปกติ)' },
    { subCategory: 'สารคัดหลั่ง / ขี้ตา', key: 'discharge_tearing_clear', label: 'มีน้ำตาไหลมากผิดปกติ (ลักษณะใส)' },
    { subCategory: 'สารคัดหลั่ง / ขี้ตา', key: 'discharge_type_mucoid', label: 'มีขี้ตา: ลักษณะเมือกใส / เหนียว (Mucoid)' },
    { subCategory: 'สารคัดหลั่ง / ขี้ตา', key: 'discharge_type_purulent', label: 'มีขี้ตา: ลักษณะเป็นหนอง (เหลือง/เขียว/ขุ่น) (Purulent)' },
    { subCategory: 'สารคัดหลั่ง / ขี้ตา', key: 'discharge_type_bloody', label: 'มีขี้ตา: ลักษณะปนเลือด (Bloody)' },
    { subCategory: 'สารคัดหลั่ง / ขี้ตา', key: 'discharge_type_brownish', label: 'มีขี้ตา: ลักษณะสีน้ำตาล/สนิม' },
    { subCategory: 'สารคัดหลั่ง / ขี้ตา', key: 'discharge_amount_low', label: 'ปริมาณขี้ตา: น้อย' },
    { subCategory: 'สารคัดหลั่ง / ขี้ตา', key: 'discharge_amount_medium', label: 'ปริมาณขี้ตา: ปานกลาง' },
    { subCategory: 'สารคัดหลั่ง / ขี้ตา', key: 'discharge_amount_high', label: 'ปริมาณขี้ตา: มาก' },
    { subCategory: 'ความแดง', key: 'redness_sclera_conjunctiva', label: 'ตาขาว / เยื่อบุตา แดงผิดปกติ' },
    { subCategory: 'ความแดง', key: 'redness_inner_eyelid', label: 'เปลือกตาด้านในแดง' },
    { subCategory: 'กระจกตา', key: 'cornea_opacity_hazy_white', label: 'กระจกตาขุ่น/ฝ้า: ขาวทึบ / เทา / หมอก' },
    { subCategory: 'กระจกตา', key: 'cornea_opacity_blueish', label: 'กระจกตาขุ่น/ฝ้า: สีฟ้า' },
    { subCategory: 'กระจกตา', key: 'cornea_ulcer_scratch', label: 'เห็นแผล / หลุม / รอยขีดข่วนบนกระจกตา' },
    { subCategory: 'กระจกตา', key: 'cornea_blood_vessels', label: 'เห็นเส้นเลือดบนกระจกตา (ปกติจะไม่มี)' },
    { subCategory: 'รูม่านตา', key: 'pupil_size_small', label: 'ขนาดรูม่านตา: เล็กกว่าปกติ (Miotic)' },
    { subCategory: 'รูม่านตา', key: 'pupil_size_large', label: 'ขนาดรูม่านตา: ใหญ่กว่าปกติ (Mydriatic)' },
    { subCategory: 'รูม่านตา', key: 'pupil_size_unequal', label: 'ขนาดรูม่านตา: สองข้างไม่เท่ากัน (Anisocoria)' },
    { subCategory: 'เปลือกตา / หนังตา', key: 'eyelid_swelling', label: 'เปลือกตาบวม' },
    { subCategory: 'เปลือกตา / หนังตา', key: 'eyelid_incomplete_closure', label: 'เปลือกตาปิดไม่สนิท' },
    { subCategory: 'เปลือกตา / หนังตา', key: 'third_eyelid_protruding', label: 'เห็นหนังตาที่สามโผล่ยื่นออกมา' },
    { subCategory: 'เปลือกตา / หนังตา', key: 'eyelid_mass_lump', label: 'มีก้อน / ตุ่ม / สิ่งผิดปกติที่เปลือกตา' },
    { subCategory: 'ส่วนอื่นๆ ของตา', key: 'lens_opacity_cataract', label: 'เลนส์ตาขุ่น (มองลึกเข้าไป อาจเห็นเป็นสีขาว/เทา)' },
    { subCategory: 'ส่วนอื่นๆ ของตา', key: 'hyphema_blood_in_eye', label: 'มีเลือดออกในช่องหน้าตา' },
    { subCategory: 'ส่วนอื่นๆ ของตา', key: 'nystagmus_eye_shaking', label: 'ตาสั่น' }
];
// --- ตัวอย่าง items สำหรับหมวด 'ลักษณะผิดปกติรอบดวงตา' ---
detailedSymptomConfig[2].items = [
    { key: 'periorbital_redness_inflammation', label: 'ผิวหนังรอบดวงตาแดง / อักเสบ' },
    { key: 'periorbital_wounds_scratches', label: 'มีแผล / รอยเกา รอบดวงตา' },
    { key: 'periorbital_hair_loss', label: 'ขนร่วงรอบดวงตา' }
];
// --- ตัวอย่าง items สำหรับหมวด 'อาการทางระบบอื่นๆ' ---
detailedSymptomConfig[3].items = [
    { key: 'weight_loss', label: 'น้ำหนักลด' },
    { key: 'increased_thirst_urination', label: 'กินน้ำมาก / ปัสสาวะบ่อยผิดปกติ' },
    { key: 'fever', label: 'มีไข้' },
    { key: 'vomiting_diarrhea', label: 'อาเจียน / ท้องเสีย' },
    { key: 'jaundice', label: 'ตัวเหลือง / เหงือกเหลือง (Jaundice)' },
    { key: 'neurologic_signs', label: 'มีอาการทางระบบประสาท (เดินเซ, เดินวน, ชัก)' },
    { key: 'other_skin_ear_issues', label: 'มีปัญหาผิวหนังส่วนอื่น / หูอักเสบ' }
];
// -----------------------------------------------------


function SymptomChecklist({ onSubmitSymptoms }) {

  // --- State สำหรับเก็บค่า Checkbox (เหมือนเดิม) ---
  const initialSymptomsState = {};
  detailedSymptomConfig.forEach(category => {
    category.items.forEach(item => {
      initialSymptomsState[`${category.keyPrefix}_${item.key}`] = false;
    });
  });
  const [symptoms, setSymptoms] = useState(initialSymptomsState);

  // --- State ใหม่สำหรับ Accordion: เก็บ keyPrefix ของหมวดที่เปิดอยู่ ---
  const [openAccordion, setOpenAccordion] = useState(null); // เริ่มต้นไม่มีหมวดไหนเปิด
  // ---------------------------------------------------------------

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSymptoms(prevSymptoms => ({
      ...prevSymptoms,
      [name]: checked
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Selected Detailed Symptoms:", symptoms);
    if (onSubmitSymptoms) {
      onSubmitSymptoms(symptoms);
    }
  };

  // --- ฟังก์ชันสำหรับ เปิด/ปิด Accordion ---
  const toggleAccordion = (keyPrefix) => {
    setOpenAccordion(openAccordion === keyPrefix ? null : keyPrefix); // ถ้ากดซ้ำที่เดิมให้ปิด, ถ้ากดอันใหม่ให้เปิดอันนั้น
  };
  // ---------------------------------------

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '10px' }}>
      <h3 style={{ marginTop: '0', marginBottom: '1em' }}>กรุณาเลือกอาการเพิ่มเติมที่สังเกตเห็น:</h3>

      {/* วนลูปสร้าง Accordion UI */}
      {detailedSymptomConfig.map(category => {
        const isAccordionOpen = openAccordion === category.keyPrefix; // เช็คว่าหมวดนี้กำลังเปิดอยู่หรือไม่

        // -- สร้างกลุ่มย่อยสำหรับหมวด 'ลักษณะผิดปกติที่ดวงตาโดยตรง' --
        let groupedItems = {};
        if (category.keyPrefix === 'eye_direct') {
          groupedItems = category.items.reduce((acc, item) => {
            const subCat = item.subCategory || 'ทั่วไป'; // ถ้าไม่มี subCategory ให้เป็น 'ทั่วไป'
            if (!acc[subCat]) {
              acc[subCat] = [];
            }
            acc[subCat].push(item);
            return acc;
          }, {});
        }
        // ------------------------------------------------------

        return (
          <div key={category.keyPrefix} style={{ marginBottom: '0.5em', borderBottom: '1px solid #eee' }}>
            {/* ส่วนหัวข้อ Accordion (กดเพื่อเปิด/ปิด) */}
            <button
              onClick={() => toggleAccordion(category.keyPrefix)}
              style={{
                width: '100%',
                padding: '10px',
                textAlign: 'left',
                background: isAccordionOpen ? '#e7f3ff' : '#f9f9f9', // สีพื้นหลังเมื่อเปิด/ปิด
                border: 'none',
                borderTop: '1px solid #eee',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontWeight: 'bold',
                fontSize: '1rem'
              }}
            >
              {category.category}
              <span>{isAccordionOpen ? '▲' : '▼'}</span> {/* ลูกศรบอกสถานะ */}
            </button>

            {/* ส่วนเนื้อหา Accordion (แสดงเมื่อ isAccordionOpen เป็น true) */}
            {isAccordionOpen && (
              <div style={{ padding: '10px 15px', background: '#fff' }}>
                {/* --- การแสดงผลแบบมีกลุ่มย่อย (เฉพาะหมวด eye_direct) --- */}
                {category.keyPrefix === 'eye_direct' ? (
                  Object.entries(groupedItems).map(([subCategoryName, subCategoryItems]) => (
                    <div key={subCategoryName} style={{ marginBottom: '0.8em' }}>
                      <h5 style={{ marginTop: '0', marginBottom: '0.5em', color: '#333', borderBottom: '1px dashed #ddd', paddingBottom: '3px' }}>
                        {subCategoryName}
                      </h5>
                      {subCategoryItems.map(item => {
                         const fullKey = `${category.keyPrefix}_${item.key}`;
                         return (
                           <div key={fullKey} style={{ marginLeft: '10px', marginBottom: '0.3em' }}>
                             <label style={{ display: 'flex', alignItems: 'center' }}>
                               <input type="checkbox" name={fullKey} checked={symptoms[fullKey]} onChange={handleCheckboxChange} style={{ marginRight: '8px' }} />
                               {item.label}
                             </label>
                           </div>
                         );
                      })}
                    </div>
                  ))
                ) : (
                  /* --- การแสดงผลแบบปกติ (สำหรับหมวดอื่นๆ) --- */
                  category.items.map(item => {
                    const fullKey = `${category.keyPrefix}_${item.key}`;
                    return (
                      <div key={fullKey} style={{ marginBottom: '0.3em' }}>
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                          <input type="checkbox" name={fullKey} checked={symptoms[fullKey]} onChange={handleCheckboxChange} style={{ marginRight: '8px' }} />
                          {item.label}
                        </label>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* ปุ่ม Submit (เหมือนเดิม) */}
      <button type="button" onClick={handleSubmit} style={{ marginTop: '1em', padding: '10px 15px' }}>
        ยืนยันอาการและดูผล
      </button>
    </div>
  );
}

export default SymptomChecklist;