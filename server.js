require("dotenv").config();

const express = require("express");
const path = require("path");
const Groq = require("groq-sdk");

const app = express();

const PORT = process.env.PORT || 3000;


// =========================
// GROQ
// =========================

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});


// =========================
// MIDDLEWARE
// =========================

app.use(express.json({
    limit: "25mb"
}));

app.use(express.urlencoded({
    extended: true,
    limit: "25mb"
}));


// =========================
// PUBLIC
// =========================

app.use(express.static(
    path.join(__dirname, "public")
));


// =========================
// HOME
// =========================

app.get("/", function (req, res) {

    res.sendFile(
        path.join(__dirname, "public", "index.html")
    );

});


// =========================
// TEST GROQ
// =========================

app.get("/api/test-groq", async function (req, res) {

    try {

        const completion =
            await groq.chat.completions.create({

                model: "openai/gpt-oss-20b",

                messages: [
                    {
                        role: "user",
                        content:
                            "ตอบคำว่า LUMERA พร้อมคำทักทายสั้น ๆ เป็นภาษาไทย"
                    }
                ]

            });


        const message =
            completion.choices[0].message.content;


        res.json({
            success: true,
            message: message
        });


    } catch (error) {

        console.error(
            "Groq Error:",
            error
        );

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});


// =========================
// AI ANALYSIS
// =========================

app.post("/api/analyze", async function (req, res) {

    try {

        const {
            gender,
            categories,
            image
        } = req.body;


        // ตรวจสอบข้อมูล

        if (!gender) {

            return res.status(400).json({
                success: false,
                error: "กรุณาระบุเพศ"
            });

        }


        if (
            !categories ||
            categories.length === 0
        ) {

            return res.status(400).json({
                success: false,
                error:
                    "กรุณาเลือกด้านความงามอย่างน้อย 1 รายการ"
            });

        }


        if (!image) {

            return res.status(400).json({
                success: false,
                error: "ไม่พบรูปภาพ"
            });

        }


        // =========================
        // LUMERA PROMPT
        // =========================

        const prompt = `

คุณคือ LUMERA AI

คุณเป็นผู้เชี่ยวชาญด้าน:
- Personal Beauty
- Fashion
- Hairstyle
- Personal Style

หน้าที่ของคุณคือวิเคราะห์รูปภาพ
และสร้างคำแนะนำด้านความงามเฉพาะบุคคล


ข้อมูลของผู้ใช้:

สำหรับ:
${gender}

ผู้ใช้ต้องการคำแนะนำด้าน:
${categories.join(", ")}


โปรดวิเคราะห์รูปภาพร่วมกับข้อมูลของผู้ใช้


ตอบเป็นภาษาไทยเท่านั้น


กรุณาตอบตามรูปแบบนี้:


1. สไตล์โดยรวม

อธิบายสไตล์ที่เหมาะกับผู้ใช้
จากสิ่งที่สังเกตได้จากภาพ


2. ทรงผม

แนะนำทรงผมที่เหมาะสม
พร้อมเหตุผลสั้น ๆ


3. การแต่งตัว

แนะนำรูปแบบเสื้อผ้า
และสไตล์การแต่งตัวที่เหมาะสม


4. สีที่เหมาะกับผู้ใช้

แนะนำโทนสีเสื้อผ้า
และสีที่สามารถนำมาใช้ร่วมกันได้


5. คำแนะนำเพิ่มเติม

ให้คำแนะนำเพิ่มเติม
เพื่อช่วยพัฒนาสไตล์ของผู้ใช้


กฎในการตอบ:

- ใช้ภาษาไทย
- สุภาพ
- เป็นมิตร
- อ่านง่าย
- นำไปใช้ได้จริง
- ไม่วิจารณ์รูปลักษณ์ในเชิงลบ
- ไม่คาดเดาอายุ
- ไม่คาดเดาเชื้อชาติ
- ไม่วินิจฉัยสุขภาพหรือโรค
- ไม่กล่าวถึงข้อมูลส่วนตัวที่ละเอียดอ่อน

แต่ละหัวข้อควรมีประมาณ 2–4 ประโยค

`;



        // =========================
        // SEND TO GROQ VISION
        // =========================

        const completion =
            await groq.chat.completions.create({

                model: "qwen/qwen3.8-27b",

                messages: [

                    {
                        role: "user",

                        content: [

                            {
                                type: "text",
                                text: prompt
                            },

                            {
                                type: "image_url",

                                image_url: {
                                    url: image
                                }

                            }

                        ]

                    }

                ]

            });


        // =========================
        // RESULT
        // =========================

        const result =
            completion.choices[0].message.content;


        res.json({

            success: true,

            result: result

        });


    } catch (error) {

        console.error(
            "LUMERA AI Error:",
            error
        );


        res.status(500).json({

            success: false,

            error: error.message

        });

    }

});


// =========================
// START SERVER
// =========================

app.listen(PORT, function () {

    console.log(
        `LUMERA server running at http://localhost:${PORT}`
    );

});