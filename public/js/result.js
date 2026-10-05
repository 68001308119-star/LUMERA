document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // GET DATA FROM SESSION STORAGE
    // =====================================================

    const uploadedImage =
        sessionStorage.getItem("uploadedImage");

    const aiResult =
        sessionStorage.getItem("aiResult");


    // =====================================================
    // GET HTML ELEMENTS
    // =====================================================

    const imageContainer =
        document.getElementById("resultProfileImage");

    const aiResultContainer =
        document.getElementById("aiResult");

    const styleTitle =
        document.getElementById("styleTitle");

    const styleDescription =
        document.getElementById("styleDescription");


    // =====================================================
    // SHOW USER IMAGE
    // =====================================================

    if (uploadedImage && imageContainer) {

        const img =
            document.createElement("img");

        img.src = uploadedImage;

        img.alt =
            "รูปภาพสำหรับวิเคราะห์สไตล์";

        img.className =
            "result-user-image";

        imageContainer.replaceChildren(img);

    } else if (imageContainer) {

        imageContainer.textContent =
            "ไม่พบรูปภาพ";

    }


    // =====================================================
    // CHECK AI RESULT
    // =====================================================

    if (!aiResult) {

        if (styleTitle) {
            styleTitle.textContent =
                "ไม่พบผลการวิเคราะห์";
        }

        if (styleDescription) {
            styleDescription.textContent =
                "กรุณากลับไปวิเคราะห์ใหม่อีกครั้ง";
        }

        if (aiResultContainer) {
            aiResultContainer.textContent =
                "ไม่พบผลการวิเคราะห์จาก LUMERA AI";
        }

        return;
    }


    // =====================================================
    // PROFILE TITLE
    // =====================================================

    if (styleTitle) {

        styleTitle.textContent =
            "LUMERA PERSONAL STYLE";

    }


    if (styleDescription) {

        styleDescription.textContent =
            "คำแนะนำเฉพาะบุคคลจาก LUMERA AI";

    }


    // =====================================================
    // FORMAT AI RESULT
    // =====================================================

    if (aiResultContainer) {

        const resultWrapper =
            document.createElement("div");

        resultWrapper.className =
            "ai-result-formatted";


        // แยกข้อความเป็นแต่ละบรรทัด
        const lines =
            aiResult.split("\n");


        let currentSection = null;


        lines.forEach(function (line) {

            // ตัดช่องว่างด้านหน้าและด้านหลัง
            const text =
                line.trim();


            // ถ้าเป็นบรรทัดว่าง
            if (!text) {

                return;

            }


            // =================================================
            // HEADINGS
            // =================================================

            if (
                text.startsWith("###") ||
                text.startsWith("##")
            ) {

                const headingText =
                    text
                        .replace(/^#+\s*/, "")
                        .replace(/\*\*/g, "")
                        .trim();


                const heading =
                    document.createElement("h3");

                heading.textContent =
                    headingText;


                heading.className =
                    "ai-result-heading";


                resultWrapper.appendChild(
                    heading
                );


                currentSection =
                    document.createElement("div");

                currentSection.className =
                    "ai-result-section";


                resultWrapper.appendChild(
                    currentSection
                );


                return;
            }


            // =================================================
            // BULLET POINT
            // =================================================

            if (
                text.startsWith("* ") ||
                text.startsWith("- ") ||
                text.startsWith("• ")
            ) {

                const bulletText =
                    text
                        .replace(/^(\*|-|•)\s*/, "")
                        .replace(/\*\*/g, "")
                        .trim();


                const bullet =
                    document.createElement("div");


                bullet.className =
                    "ai-result-bullet";


                bullet.innerHTML =
                    "• " + escapeHTML(bulletText);


                if (currentSection) {

                    currentSection.appendChild(
                        bullet
                    );

                } else {

                    resultWrapper.appendChild(
                        bullet
                    );

                }


                return;
            }


            // =================================================
            // NORMAL PARAGRAPH
            // =================================================

            const paragraph =
                document.createElement("p");


            paragraph.className =
                "ai-result-paragraph";


            paragraph.innerHTML =
                formatBoldText(text);


            if (currentSection) {

                currentSection.appendChild(
                    paragraph
                );

            } else {

                resultWrapper.appendChild(
                    paragraph
                );

            }

        });


        aiResultContainer.replaceChildren(
            resultWrapper
        );

    }


});


// =========================================================
// FORMAT BOLD TEXT
// =========================================================

function formatBoldText(text) {

    const escaped =
        escapeHTML(text);


    return escaped.replace(
        /\*\*(.*?)\*\*/g,
        "<strong>$1</strong>"
    );

}


// =========================================================
// ESCAPE HTML
// =========================================================

function escapeHTML(text) {

    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}