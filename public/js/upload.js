// =========================
// IMAGE UPLOAD
// =========================

const imageInput =
    document.getElementById("imageInput");

const imagePreview =
    document.getElementById("imagePreview");


imageInput.addEventListener(
    "change",
    function () {

        const file =
            imageInput.files[0];

        if (!file) {
            return;
        }


        if (
            file.type !== "image/jpeg" &&
            file.type !== "image/png"
        ) {

            alert(
                "กรุณาเลือกไฟล์ JPG, JPEG หรือ PNG"
            );

            imageInput.value = "";

            return;
        }


        const reader =
            new FileReader();


        reader.onload =
            function (event) {

                imagePreview.innerHTML = `
                    <img
                        src="${event.target.result}"
                        alt="รูปภาพของคุณ"
                    >
                `;

            };


        reader.readAsDataURL(file);

    }
);


// =========================
// ANALYZE BUTTON
// =========================

const analyzeButton =
    document.getElementById(
        "analyzeButton"
    );


analyzeButton.addEventListener(
    "click",
    async function () {

        const file =
            imageInput.files[0];


        if (!file) {

            alert(
                "กรุณาเลือกรูปภาพก่อนเริ่มวิเคราะห์"
            );

            return;
        }


        const gender =
            sessionStorage.getItem(
                "selectedGender"
            );


        const categories =
            JSON.parse(
                sessionStorage.getItem(
                    "selectedCategories"
                ) || "[]"
            );


        if (!gender) {

            alert(
                "ไม่พบข้อมูลการเลือก กรุณากลับไปเลือกข้อมูลใหม่"
            );

            window.location.href =
                "analysis.html";

            return;
        }


        if (categories.length === 0) {

            alert(
                "ไม่พบด้านความงามที่เลือก กรุณาเลือกใหม่"
            );

            window.location.href =
                "analysis.html";

            return;
        }


        // =========================
        // READ IMAGE
        // =========================

        const reader =
            new FileReader();


        reader.onload =
            async function (event) {

                const image =
                    event.target.result;


                // เก็บรูปไว้สำหรับหน้า Result

                sessionStorage.setItem(
                    "uploadedImage",
                    image
                );


                sessionStorage.setItem(
                    "uploadedImageName",
                    file.name
                );


                // =========================
                // BUTTON LOADING
                // =========================

                analyzeButton.disabled =
                    true;

                analyzeButton.innerText =
                    "LUMERA AI กำลังวิเคราะห์...";


                try {

                    // =========================
                    // SEND DATA TO SERVER
                    // =========================

                    const response =
                        await fetch(
                            "/api/analyze",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body: JSON.stringify({

                                    gender:
                                        gender,

                                    categories:
                                        categories,

                                    image:
                                        image

                                })

                            }
                        );


                    const data =
                        await response.json();


                    // =========================
                    // CHECK RESULT
                    // =========================

                    if (!data.success) {

                        throw new Error(
                            data.error ||
                            "ไม่สามารถวิเคราะห์ได้"
                        );

                    }


                    // =========================
                    // SAVE AI RESULT
                    // =========================

                    sessionStorage.setItem(
                        "aiResult",
                        data.result
                    );


                    // =========================
                    // GO TO RESULT PAGE
                    // =========================

                    window.location.href =
                        "result.html";


                } catch (error) {

                    console.error(
                        "Analysis Error:",
                        error
                    );


                    alert(
                        "เกิดข้อผิดพลาดในการวิเคราะห์\n\n" +
                        error.message
                    );


                    analyzeButton.disabled =
                        false;

                    analyzeButton.innerText =
                        "เริ่มวิเคราะห์ →";

                }

            };


        reader.readAsDataURL(file);

    }
);