
const uploadedImage =
    sessionStorage.getItem("uploadedImage");

const aiResult =
    sessionStorage.getItem("aiResult");

const imageContainer =
    document.getElementById("resultProfileImage");

const aiResultContainer =
    document.getElementById("aiResult");

const styleTitle =
    document.getElementById("styleTitle");

const styleDescription =
    document.getElementById("styleDescription");


// แสดงรูปภาพของผู้ใช้
if (uploadedImage) {
    const img = document.createElement("img");

    img.src = uploadedImage;
    img.alt = "รูปภาพสำหรับวิเคราะห์สไตล์";
    img.className = "result-user-image";

    imageContainer.replaceChildren(img);
} else {
    imageContainer.textContent = "ไม่พบรูปภาพ";
}


// แสดงผลวิเคราะห์จาก AI
if (!aiResult) {
    styleTitle.textContent = "ไม่พบผลการวิเคราะห์";
    styleDescription.textContent =
        "กรุณากลับไปวิเคราะห์ใหม่อีกครั้ง";

    aiResultContainer.textContent =
        "ไม่พบผลการวิเคราะห์จาก LUMERA AI";

} else {
    styleTitle.textContent = "LUMERA PERSONAL STYLE";

    styleDescription.textContent =
        "คำแนะนำเฉพาะบุคคลจาก LUMERA AI";

    // แสดงคำตอบทั้งหมดจาก AI
    // ใช้ textContent เพื่อไม่ให้ข้อความถูกตีความเป็น HTML
    const resultText = document.createElement("div");

    resultText.className = "ai-result-text";
    resultText.textContent = aiResult;

    aiResultContainer.replaceChildren(resultText);
}