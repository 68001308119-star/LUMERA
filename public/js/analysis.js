// =========================
// GENDER SELECTION
// =========================

const genderButtons =
    document.querySelectorAll(".choice-button");

let selectedGender = "";

genderButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        genderButtons.forEach(function (item) {
            item.classList.remove("selected");
        });

        button.classList.add("selected");

        selectedGender =
            button.innerText.trim();

        console.log(
            "เพศที่เลือก:",
            selectedGender
        );

    });

});


// =========================
// CATEGORY SELECTION
// =========================

const categoryButtons =
    document.querySelectorAll(".category-button");

let selectedCategories = [];

categoryButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        button.classList.toggle("selected");

        const category =
            button.innerText.trim();

        if (button.classList.contains("selected")) {

            selectedCategories.push(category);

        } else {

            selectedCategories =
                selectedCategories.filter(
                    function (item) {
                        return item !== category;
                    }
                );

        }

        console.log(
            "ด้านความงามที่เลือก:",
            selectedCategories
        );

    });

});


// =========================
// CONTINUE BUTTON
// =========================

const continueButton =
    document.querySelector(".continue-button");

continueButton.addEventListener(
    "click",
    function () {

        // ตรวจสอบเพศ

        if (selectedGender === "") {

            alert(
                "กรุณาเลือกผู้ที่ต้องการรับคำแนะนำก่อน"
            );

            return;
        }


        // ตรวจสอบหมวดหมู่

        if (
            selectedCategories.length === 0
        ) {

            alert(
                "กรุณาเลือกด้านความงามที่ต้องการคำแนะนำอย่างน้อย 1 รายการ"
            );

            return;
        }


        // =========================
        // SAVE USER DATA
        // =========================

        sessionStorage.setItem(
            "selectedGender",
            selectedGender
        );

        sessionStorage.setItem(
            "selectedCategories",
            JSON.stringify(
                selectedCategories
            )
        );


        console.log(
            "========== LUMERA =========="
        );

        console.log(
            "สำหรับ:",
            selectedGender
        );

        console.log(
            "ด้านที่เลือก:",
            selectedCategories
        );


        // ไปหน้า Upload

        window.location.href =
            "upload.html";

    }
);