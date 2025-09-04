// مدیریت فیلترها
document.querySelector(".btn-primary").addEventListener("click", function () {
    // در اینجا کد اعمال فیلترها قرار می‌گیرد
    console.log("فیلترها اعمال شدند");
    // این بخش باید با داده‌های واقعی از دیتابیس پر شود
});

document.querySelector(".btn-secondary").addEventListener("click", function () {
    // بازنشانی تمام فیلترها
    document.getElementById("filter-grade").value = "";
    document.getElementById("filter-lesson").value = "";
    document.getElementById("filter-topic").value = "";
    document.getElementById("filter-difficulty").value = "";
    document.getElementById("filter-type").value = "";
    document.getElementById("filter-search").value = "";

    console.log("فیلترها بازنشانی شدند");
});

// مدیریت صفحه‌بندی
document.querySelectorAll(".pagination-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
        document.querySelectorAll(".pagination-btn").forEach((b) => {
            b.classList.remove("active");
        });

        if (!this.querySelector("i")) {
            this.classList.add("active");
        }

        // در اینجا کد بارگذاری صفحه مورد نظر قرار می‌گیرد
        console.log("صفحه تغییر کرد");
    });
});

// مدیریت عملیات سوالات
document.querySelectorAll(".questions-table .btn").forEach((btn) => {
    btn.addEventListener("click", function () {
        const row = this.closest("tr");
        const questionId = row.querySelector("td:first-child").textContent;

        if (this.classList.contains("btn-danger")) {
            // حذف سوال
            if (confirm(`آیا از حذف سوال شماره ${questionId} اطمینان دارید؟`)) {
                row.remove();
                console.log(`سوال ${questionId} حذف شد`);
            }
        } else if (this.classList.contains("btn-secondary")) {
            // ویرایش سوال
            console.log(`ویرایش سوال ${questionId}`);
            // اینجا می‌توانید کاربر را به صفحه ویرایش هدایت کنید
        }
    });
});

async function fetchTotalQuestions() {
    try {
        const response = await fetch(
            "http://localhost:5000/api/questions/count"
        );
        if (!response.ok) {
            throw new Error("Failed to fetch total question count.");
        }
        const data = await response.json();

        const totalQuestionsElement = document.querySelector(
            ".stat-card .stat-value"
        );
        if (totalQuestionsElement) {
            totalQuestionsElement.innerText =
                data.totalQuestions.toLocaleString("fa-IR");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const questionsContainer = document.querySelector(".questions-table tbody");
    const loadMoreBtn = document.querySelector("#load-more-btn");
    const applyFiltersBtn = document.querySelector(".btn-primary");
    const resetFiltersBtn = document.querySelector(".btn-secondary");

    let offset = 0;
    const limit = 10;
    let currentFilters = {};

    // نمایش پیام راهنما در زمان بارگذاری اولیه صفحه
    questionsContainer.innerHTML = `<tr><td colspan="3">لطفاً فیلترهای خود را انتخاب و اعمال کنید.</td></tr>`;
    if (loadMoreBtn) {
        loadMoreBtn.style.display = "none";
    }

    // نمایش تعداد مجموع سوالات
    fetchTotalQuestions();

    // تابعی برای ساخت پارامترهای URL از روی فیلترها
    function buildQueryParams(filters) {
        const params = new URLSearchParams();
        for (const key in filters) {
            if (filters[key] && filters[key] !== "") {
                params.append(key, filters[key]);
            }
        }
        return params.toString();
    }

    // تابعی برای واکشی سوالات از API و رندر کردن در جدول
    async function fetchAndRenderQuestions(isNewSearch = false) {
        if (isNewSearch) {
            offset = 0;
            questionsContainer.innerHTML = "";
        }

        const queryParams = buildQueryParams({
            ...currentFilters,
            limit: limit,
            offset: offset,
        });

        try {
            // نمایش پیام بارگذاری
            if (loadMoreBtn) {
                loadMoreBtn.disabled = true;
                loadMoreBtn.innerText = "درحال بارگذاری...";
            } else {
                questionsContainer.innerHTML = `<tr><td colspan="3">درحال بارگذاری...</td></tr>`;
            }

            const url = `http://localhost:5000/api/questions?${queryParams}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();

            // بررسی تعداد سوالات برگشتی
            if (data.questions && data.questions.length > 0) {
                data.questions.forEach((question) => {
                    const optionsHtml = question.options
                        .map((option, index) => {
                            const isCorrectClass = option.isCorrect
                                ? "is-correct"
                                : "";
                            return `
                                <div class="option ${isCorrectClass}">
                                    <span class="option-number">${
                                        index + 1
                                    }</span>
                                    <span class="option-text">${
                                        option.text
                                    }</span>
                                </div>
                            `;
                        })
                        .join("");

                    const questionRowHtml = `
                        <tr class="question-row">
                            <td colspan="3">
                                <div class="question-info">
                                    <div class="info-item"><span class="info-label">پایه:</span><span class="info-value">${
                                        question.grade
                                    }</span></div>
                                    <div class="info-item"><span class="info-label">درس:</span><span class="info-value">${
                                        question.lesson
                                    }</span></div>
                                    <div class="info-item"><span class="info-label">موضوع:</span><span class="info-value">${
                                        question.topic
                                    }</span></div>
                                    <div class="info-item"><span class="info-label">سختی:</span><span class="info-value">${
                                        question.difficulty
                                    }</span></div>
                                    <div class="info-item"><span class="info-label">منبع:</span><span class="info-value">${
                                        question.questionSource
                                    }</span></div>
                                </div>
                                <div class="question-content">
                                    <div class="question-title">${
                                        question.title ||
                                        "گزینه‌ی صحیح را انتخاب کنید."
                                    }</div>
                                    <div class="question-text">${
                                        question.text
                                    }</div>
                                    <div class="options-row">${optionsHtml}</div>
                                </div>
                                <div class="question-separator"></div>
                            </td>
                        </tr>
                    `;

                    questionsContainer.innerHTML += questionRowHtml;
                });

                offset += data.questions.length;

                if (loadMoreBtn) {
                    if (data.questions.length < limit) {
                        loadMoreBtn.style.display = "none";
                    } else {
                        loadMoreBtn.style.display = "block";
                        loadMoreBtn.disabled = false;
                        loadMoreBtn.innerText = "نمایش بیشتر";
                    }
                }
            } else {
                questionsContainer.innerHTML = `<tr><td colspan="3">هیچ سوالی یافت نشد.</td></tr>`;
                if (loadMoreBtn) loadMoreBtn.style.display = "none";
            }
        } catch (error) {
            console.error("خطا در دریافت سوالات:", error);
            if (loadMoreBtn) {
                loadMoreBtn.disabled = false;
                loadMoreBtn.innerText = "خطا در بارگذاری";
            }
            questionsContainer.innerHTML = `<tr><td colspan="3">خطا در دریافت اطلاعات. لطفاً دوباره تلاش کنید.</td></tr>`;
        }
    }

    // هندلر برای دکمه "اعمال فیلترها"
    function handleApplyFilters() {
        currentFilters = {
            grade: document.getElementById("filter-grade").value,
            lesson: document.getElementById("filter-lesson").value,
            topic: document.getElementById("filter-topic").value,
            difficulty: document.getElementById("filter-difficulty").value,
            questionType: document.getElementById("filter-type").value,
            searchText: document.getElementById("filter-search").value.trim(),
        };
        fetchAndRenderQuestions(true);
    }

    // هندلر برای دکمه "بازنشانی فیلترها"
    function handleResetFilters() {
        document.getElementById("filter-grade").value = "";
        document.getElementById("filter-lesson").value = "";
        document.getElementById("filter-topic").value = "";
        document.getElementById("filter-difficulty").value = "";
        document.getElementById("filter-type").value = "";
        document.getElementById("filter-search").value = "";

        currentFilters = {};
        questionsContainer.innerHTML = `<tr><td colspan="3">لطفاً فیلترهای خود را انتخاب و اعمال کنید.</td></tr>`;
        if (loadMoreBtn) loadMoreBtn.style.display = "none";
    }

    // اتصال event listener ها
    applyFiltersBtn.addEventListener("click", handleApplyFilters);
    resetFiltersBtn.addEventListener("click", handleResetFilters);
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener("click", () =>
            fetchAndRenderQuestions(false)
        );
    }
});
