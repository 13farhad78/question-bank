// مدیریت تب‌ها
document.querySelectorAll(".tab-btn").forEach((button) => {
    button.addEventListener("click", () => {
        // حذف کلاس active از همه دکمه‌ها
        document.querySelectorAll(".tab-btn").forEach((btn) => {
            btn.classList.remove("active");
        });

        // اضافه کردن کلاس active به دکمه کلیک شده
        button.classList.add("active");

        // مخفی کردن همه محتواهای تب
        document.querySelectorAll(".tab-content").forEach((content) => {
            content.classList.remove("active");
        });

        // نمایش محتوای تب مربوطه
        const tabId = button.getAttribute("data-tab");
        document.getElementById(tabId).classList.add("active");
    });
});

// داده‌های دروس بر اساس پایه
const lessonsByGrade = {
    9: ["درس 1", "درس 2", "درس 3", "درس 4", "درس 5", "درس 6"],
    10: ["درس 1", "درس 2", "درس 3", "درس 4"],
    11: ["درس 1", "درس 2", "درس 3", "درس 4"],
    12: ["درس 1", "درس 2", "درس 3"],
};

// پر کردن سال‌ها از 1398 تا 1404
function populateYearDropdowns() {
    const yearDropdowns = [
        document.getElementById("year-12"),
        document.getElementById("year-9"),
    ];

    for (let year = 1404; year >= 1398; year--) {
        yearDropdowns.forEach((dropdown) => {
            if (dropdown) {
                const option = document.createElement("option");
                option.value = year;
                option.textContent = year;
                dropdown.appendChild(option);
            }
        });
    }
}

// مدیریت تغییر پایه تحصیلی
document.getElementById("grade").addEventListener("change", function () {
    const grade = this.value;
    const lessonDropdown = document.getElementById("lesson");

    // پاک کردن گزینه‌های قبلی
    lessonDropdown.innerHTML = '<option value="">انتخاب درس</option>';

    // پر کردن دروس بر اساس پایه انتخاب شده
    if (grade && lessonsByGrade[grade]) {
        lessonsByGrade[grade].forEach((lesson) => {
            const option = document.createElement("option");
            option.value = lesson;
            option.textContent = lesson;
            lessonDropdown.appendChild(option);
        });
    }

    // بررسی نمایش فیلدهای نهایی
    checkFinalFields();
});

// مدیریت تغییر نوع سوال
document
    .getElementById("question-source")
    .addEventListener("change", function () {
        checkFinalFields();
    });

// بررسی و نمایش فیلدهای مربوط به سوالات نهایی
function checkFinalFields() {
    const questionType = document.getElementById("question-source").value;
    const grade = document.getElementById("grade").value;

    const final12thMonth = document.getElementById("final-12th-month");
    const final12thYear = document.getElementById("final-12th-year");

    const final9thYear = document.getElementById("final-9th-year");
    const final9thProvince = document.getElementById("final-9th-province");

    // مخفی کردن همه فیلدها در ابتدا
    final12thMonth.style.display = "none";
    final12thYear.style.display = "none";
    final9thYear.style.display = "none";
    final9thProvince.style.display = "none";

    // نمایش فیلدهای مربوطه در صورت انتخاب نوع نهایی
    if (questionType === "final") {
        if (grade === "12") {
            final12thMonth.style.display = "block";
            final12thYear.style.display = "block";
        } else if (grade === "9") {
            final9thYear.style.display = "block";
            final9thProvince.style.display = "block";
        }
    }
}

// مدیریت گزینه‌های چندگزینه‌ای
let optionCounter = 0;
const optionsContainer = document.getElementById("options-container");
const addOptionBtn = document.getElementById("add-option");

// افزودن گزینه جدید
function addOption() {
    optionCounter++;
    const optionId = `option-${optionCounter}`;

    const optionItem = document.createElement("div");
    optionItem.className = "option-item";
    optionItem.id = optionId;

    optionItem.innerHTML = `
                    <div class="option-actions">
                        <button type="button" class="option-btn btn-correct" title="Mark as correct answer">
                            <i class="fas fa-check"></i>
                        </button>
                        <button type="button" class="option-btn btn-remove" title="Remove option">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="input-with-paste">
                        <input type="text" class="option-input" placeholder="Option ${optionCounter}" dir="ltr">
                        <button type="button" class="paste-icon-button" title="Paste from clipboard">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                            </svg>
                        </button>
                    </div>
            `;

    optionsContainer.appendChild(optionItem);

    // اضافه کردن رویداد برای دکمه حذف
    const removeBtn = optionItem.querySelector(".btn-remove");
    removeBtn.addEventListener("click", () => {
        optionItem.remove();
        optionCounter--;
    });

    // اضافه کردن رویداد برای دکمه صحیح
    const correctBtn = optionItem.querySelector(".btn-correct");
    correctBtn.addEventListener("click", () => {
        // حذف انتخاب از تمام دکمه‌های صحیح
        document.querySelectorAll(".btn-correct").forEach((btn) => {
            btn.classList.remove("selected");
        });

        // انتخاب گزینه فعلی
        correctBtn.classList.add("selected");
    });

    // انیمیشن برای گزینه جدید
    optionItem.style.animation = "slideIn 0.3s ease";

    // انتخاب المنت‌های تازه ساخته شده
    const optionInput = optionItem.querySelector(".option-input");
    const pasteButton = optionItem.querySelector(".paste-icon-button");

    // اضافه کردن Event Listener به دکمه پیست
    pasteButton.addEventListener("click", async () => {
        try {
            const clipboardText = await navigator.clipboard.readText();
            optionInput.value = clipboardText;
        } catch (err) {
            console.error("Failed to read clipboard contents: ", err);
            alert("Access to clipboard denied. Please paste manually.");
        }
    });
}

// افزودن 4 گزینه اولیه
for (let i = 0; i < 4; i++) {
    addOption();
}

// رویداد کلیک برای دکمه افزودن گزینه
addOptionBtn.addEventListener("click", addOption);

// مقداردهی اولیه هنگام لود صفحه
document.addEventListener("DOMContentLoaded", function () {
    populateYearDropdowns();
    checkFinalFields();

    // انتخاب اولین گزینه به عنوان پاسخ صحیح
    const firstCorrectBtn = document.querySelector(".btn-correct");
    if (firstCorrectBtn) {
        firstCorrectBtn.classList.add("selected");
    }
});

// ارسال مقادیر به دیتابیس
const saveBtn = document.querySelector(".btn-primary");
saveBtn.addEventListener("click", async () => {
    // 1. اعتبارسنجی ورودی‌ها
    const titleInput = document.getElementById("question-title");
    const textInput = document.getElementById("question-text");
    const gradeInput = document.getElementById("grade");
    const subjectInput = document.getElementById("lesson");

    if (
        !titleInput.value ||
        !textInput.value ||
        !gradeInput.value ||
        !subjectInput.value
    ) {
        showToast("لطفاً فیلدهای ضروری را پر کنید.", "error");
        return; // جلوگیری از ارسال درخواست
    }

    try {
        const question = {
            title: titleInput.value.trim(),
            text: textInput.value.trim(),
            grade: gradeInput.value,
            subject: subjectInput.value,
            topic: document.getElementById("topic").value,
            difficulty: document.getElementById("difficulty").value,
            questionSource: document.getElementById("question-source").value,
            questionType: document.querySelector(".tab-btn.active").dataset.tab,
            // دریافت صحیح مقادیر سال و ماه
            year: document.getElementById("year-12")
                ? document.getElementById("year-12").value
                : null,
            month: document.getElementById("month-12")
                ? document.getElementById("month-12").value
                : null,
            province: document.getElementById("province")
                ? document.getElementById("province").value
                : null,
            options: Array.from(
                document.querySelectorAll("#options-container .option-item")
            ).map((item) => ({
                text: item.querySelector('input[type="text"]').value,
                isCorrect: item
                    .querySelector(".btn-correct")
                    .classList.contains("selected"),
            })),
        };

        const res = await fetch("http://localhost:5000/api/questions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(question),
        });

        const data = await res.json();

        // بررسی پاسخ سرور
        if (res.status === 201) {
            showToast("✅ سوال با موفقیت ذخیره شد.");
            scrollToTop();
            resetForm();
        } else {
            showToast("خطا در ذخیره سوال!", "error");
            console.error("Server Error:", data);
        }
    } catch (error) {
        showToast("خطا در ارتباط با سرور!", "error");
        console.error("Network Error:", error);
    }
});

// نمایش پیغام خطا یا موفقیت ذخیره سوال
function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast-notification ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Fade-in effect
    setTimeout(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateY(0)";
    }, 10);

    // Fade-out effect and remove after 3 seconds
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(-20px)";
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
}

// ریست کردن اینپوت ها
const resetForm = () => {
    document.querySelector(".tab-content.active").reset();
    document.getElementById("question-info-form").reset();
};

// انتخاب المان‌های HTML
const pasteButton = document.querySelector(".paste-icon-button");
const questionTextarea = document.querySelector(".question-text-fa");

// اضافه کردن Event Listener برای کلیک روی دکمه
pasteButton.addEventListener("click", async () => {
    try {
        // خواندن متن از کلیپ بورد
        const clipboardText = await navigator.clipboard.readText();

        // قرار دادن متن در textarea
        questionTextarea.value = clipboardText;
    } catch (err) {
        // مدیریت خطا در صورت عدم دسترسی یا خطا
        console.error("Failed to read clipboard contents: ", err);
        alert(
            "متاسفانه امکان دسترسی به کلیپ‌بورد وجود ندارد. لطفا به صورت دستی Paste کنید."
        );
    }
});

const pasteBtn = document.querySelector(".paste-icon-button-en");
const questionTextareaEn = document.querySelector(".question-text-en");

pasteBtn.addEventListener("click", async () => {
    try {
        // خواندن متن از کلیپ بورد
        const clipboardText = await navigator.clipboard.readText();

        // قرار دادن متن در textarea
        questionTextareaEn.value = clipboardText;
    } catch (err) {
        // مدیریت خطا در صورت عدم دسترسی یا خطا
        console.error("Failed to read clipboard contents: ", err);
        alert(
            "متاسفانه امکان دسترسی به کلیپ‌بورد وجود ندارد. لطفا به صورت دستی Paste کنید."
        );
    }
});

// یک تابع برای تنظیم خودکار ارتفاع textarea
function autoResizeTextarea(element) {
    element.style.height = "auto";
    element.style.height = element.scrollHeight + "px";
}

// انتخاب هر دو المنت textarea
const faTextarea = document.querySelector(".question-text-fa");
const enTextarea = document.querySelector(".question-text-en");

// اضافه کردن event listener با استفاده از تابع
if (faTextarea) {
    faTextarea.addEventListener("input", () => autoResizeTextarea(faTextarea));
}

if (enTextarea) {
    enTextarea.addEventListener("input", () => autoResizeTextarea(enTextarea));
}
