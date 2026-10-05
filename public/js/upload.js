document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // ELEMENTS
    // =====================================================

    const uploadInput =
        document.getElementById("imageInput");

    const previewImage =
        document.getElementById("previewImage");

    const previewContainer =
        document.getElementById("imagePreview");

    const analyzeButton =
        document.getElementById("analyzeButton");

    const fileName =
        document.getElementById("fileName");


    // เก็บไฟล์รูปที่ผู้ใช้เลือก
    let selectedImage = null;


    // =====================================================
    // IMAGE UPLOAD
    // =====================================================

    if (uploadInput) {

        uploadInput.addEventListener(
            "change",
            function (event) {

                const file =
                    event.target.files[0];


                // ไม่มีไฟล์
                if (!file) {
                    return;
                }


                // =================================================
                // CHECK FILE TYPE
                // =================================================

                if (!file.type.startsWith("image/")) {

                    alert(
                        "กรุณาเลือกไฟล์รูปภาพเท่านั้นค่ะ"
                    );

                    uploadInput.value = "";

                    return;
                }


                // =================================================
                // CHECK FILE SIZE
                // =================================================

                // จำกัดไม่เกิน 10 MB
                if (file.size > 10 * 1024 * 1024) {

                    alert(
                        "รูปภาพต้องมีขนาดไม่เกิน 10 MB ค่ะ"
                    );

                    uploadInput.value = "";

                    return;
                }


                // เก็บไฟล์
                selectedImage = file;


                // =================================================
                // SHOW FILE NAME
                // =================================================

                if (fileName) {

                    fileName.textContent =
                        "ไฟล์ที่เลือก: " + file.name;
                }


                // =================================================
                // PREVIEW IMAGE
                // =================================================

                const reader =
                    new FileReader();


                reader.onload = function (e) {

                    if (previewImage) {

                        previewImage.src =
                            e.target.result;

                        previewImage.style.display =
                            "block";
                    }


                    if (previewContainer) {

                        previewContainer.style.display =
                            "block";
                    }

                };


                reader.readAsDataURL(file);

            }
        );

    }


    // =====================================================
    // ANALYZE BUTTON
    // =====================================================

    if (analyzeButton) {

        analyzeButton.addEventListener(
            "click",
            async function () {


                // =================================================
                // CHECK IMAGE
                // =================================================

                if (!selectedImage) {

                    alert(
                        "กรุณาเลือกรูปภาพก่อนค่ะ"
                    );

                    return;
                }


                // =================================================
                // GET GENDER
                // =================================================

                let gender = "";


                const genderElement =
                    document.querySelector(
                        'input[name="gender"]:checked'
                    );


                if (genderElement) {

                    gender =
                        genderElement.value;
                }


                // =================================================
                // GET CATEGORIES
                // =================================================

                let categories = [];


                // รองรับ name="category"
                const categoryElements =
                    document.querySelectorAll(
                        'input[name="category"]:checked'
                    );


                categoryElements.forEach(
                    function (element) {

                        categories.push(
                            element.value
                        );

                    }
                );


                // รองรับ name="categories"
                if (categories.length === 0) {

                    const alternativeCategories =
                        document.querySelectorAll(
                            'input[name="categories"]:checked'
                        );


                    alternativeCategories.forEach(
                        function (element) {

                            categories.push(
                                element.value
                            );

                        }
                    );

                }


                // =================================================
                // CHECK CATEGORY
                // =================================================

                /*
                    ถ้าไม่มี checkbox หมวดหมู่
                    ให้ใช้ค่าพื้นฐานแทน
                */

                if (categories.length === 0) {

                    categories = [
                        "ทรงผม",
                        "การแต่งตัว",
                        "สีที่เหมาะกับคุณ"
                    ];

                }


                // =================================================
                // BUTTON LOADING
                // =================================================

                const originalText =
                    analyzeButton.textContent;


                analyzeButton.disabled =
                    true;


                analyzeButton.textContent =
                    "LUMERA กำลังวิเคราะห์...";


                // =================================================
                // READ IMAGE
                // =================================================

                const reader =
                    new FileReader();


                reader.onload = async function (event) {

                    try {

                        const imageData =
                            event.target.result;


                        // =================================================
                        // SAVE IMAGE
                        // =================================================

                        sessionStorage.setItem(
                            "uploadedImage",
                            imageData
                        );


                        // =================================================
                        // SEND IMAGE TO SERVER
                        // =================================================

                        const response =
                            await fetch(
                                "/api/analyze",
                                {
                                    method: "POST",

                                    headers: {
                                        "Content-Type":
                                            "application/json"
                                    },

                                    body:
                                        JSON.stringify({

                                            gender:
                                                gender ||
                                                "ไม่ได้ระบุ",

                                            categories:
                                                categories,

                                            image:
                                                imageData

                                        })
                                }
                            );


                        // =================================================
                        // GET SERVER RESPONSE
                        // =================================================

                        const data =
                            await response.json();


                        // =================================================
                        // CHECK RESPONSE
                        // =================================================

                        if (
                            !response.ok ||
                            !data.success
                        ) {

                            throw new Error(
                                data.error ||
                                "ไม่สามารถวิเคราะห์รูปภาพได้"
                            );

                        }


                        // =================================================
                        // SAVE AI RESULT
                        // =================================================

                        sessionStorage.setItem(
                            "aiResult",
                            data.result
                        );


                        sessionStorage.setItem(
                            "analysisGender",
                            gender ||
                            "ไม่ได้ระบุ"
                        );


                        sessionStorage.setItem(
                            "analysisCategories",
                            JSON.stringify(
                                categories
                            )
                        );


                        // =================================================
                        // GO TO RESULT PAGE
                        // =================================================

                        window.location.href =
                            "/result.html";


                    } catch (error) {

                        console.error(
                            "Analysis Error:",
                            error
                        );


                        alert(
                            "เกิดข้อผิดพลาดในการวิเคราะห์ค่ะ\n\n" +
                            error.message
                        );


                        // เปิดปุ่มกลับมา
                        analyzeButton.disabled =
                            false;


                        analyzeButton.textContent =
                            originalText;

                    }

                };


                reader.readAsDataURL(
                    selectedImage
                );

            }
        );

    }

});