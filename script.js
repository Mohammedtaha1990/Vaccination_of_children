// ====== حفظ بيانات الطفل ======
function saveChild(event) {
    event.preventDefault(); // منع إعادة تحميل الصفحة

    const child = {
        name: document.getElementById('name').value,
        birthDate: document.getElementById('birthDate').value,
        birthplace: document.getElementById('birthplace').value,
        governorate: document.getElementById('governorate').value,
        directorate: document.getElementById('directorate').value,
        healthFacility: document.getElementById('healthFacility').value,
        village: document.getElementById('village').value,
        issueDate: document.getElementById('issueDate').value,
        pageNumber: document.getElementById('pageNumber').value,
        cardNumber: document.getElementById('cardNumber').value
    };

    // استرجاع البيانات الحالية من Local Storage
    const children = JSON.parse(localStorage.getItem('children')) || [];
    children.push(child); // إضافة الطفل الجديد
    localStorage.setItem('children', JSON.stringify(children)); // حفظ البيانات

    alert("تم حفظ بيانات الطفل بنجاح!");
    document.getElementById('childForm').reset(); // مسح النموذج
    document.getElementById('nextButton').style.display = "block"; // إظهار زر التالي
}

// ====== البحث عن طفل ======
function searchChild() {
    let inputName = document.getElementById("searchInput").value.trim().toLowerCase();
    let children = JSON.parse(localStorage.getItem("children")) || [];

    if (children.length === 0) {
        alert("لا توجد بيانات مخزنة.");
        return;
    }

    let results = children.filter(child => child.name.trim().toLowerCase().includes(inputName));

    displayResults(results);
}

// ====== عرض نتائج البحث ======
function displayResults(results) {
    const resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = ""; // مسح النتائج السابقة

    if (results.length === 0) {
        resultsDiv.innerHTML = "<p>لا توجد نتائج</p>";
        return;
    }

    results.forEach(child => {
        const childDiv = document.createElement("div");
        childDiv.className = "child-result";
        childDiv.innerHTML = `
            <p><strong>الاسم:</strong> ${child.name}</p>
            <p><strong>تاريخ الميلاد:</strong> ${child.birthDate}</p>
            <p><strong>مكان الميلاد:</strong> ${child.birthplace}</p>
        `;
        resultsDiv.appendChild(childDiv);
    });
}

// ====== حساب عمر الطفل بالأيام ======
function calculateAgeInDays(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    return Math.floor((today - birth) / (1000 * 60 * 60 * 24));
}

// ====== تحديد نوع التطعيم بناءً على العمر ======
function determineVaccineType(ageInDays) {
    return ageInDays <= 365 ? "تطعيم أقل من عام" : "تطعيم أكبر من عام";
}

// ====== عرض عمر الطفل ونوع التطعيم ======
function displayChildAge() {
    const childAgeElement = document.getElementById('childAge');
    const vaccineTypeElement = document.getElementById('vaccineType');

    if (childAgeElement && vaccineTypeElement) {
        const children = JSON.parse(localStorage.getItem('children')) || [];
        const lastChild = children[children.length - 1];

        if (!lastChild || !lastChild.birthDate) {
            alert("لم يتم العثور على تاريخ ميلاد الطفل.");
            return;
        }

        const ageInDays = calculateAgeInDays(lastChild.birthDate);
        childAgeElement.innerText = `عمر الطفل بالأيام: ${ageInDays}`;
        vaccineTypeElement.innerText = `نوع التطعيم: ${determineVaccineType(ageInDays)}`;
    }
}

// ====== إدارة جرعات التطعيمات ======
const doses = {
    "السل": ["جرعة واحدة"],
    "الكبد ب": ["جرعة واحدة"],
    "الشلل الفموي": ["تمهيدي", "1", "2", "3", "4", "5"],
    "شلل حقن": ["1", "2"],
    "الخماسي": ["1", "2", "3", "تنشيطية"],
    "المكورات الرئوية": ["1", "2", "3"],
    "الروتا": ["1", "2"],
    "الحصبة والحصبة الألمانية": ["1", "2"],
    "فيتامين أ": ["100 و.د", "200 و.د"]
};

function toggleDoses(element) {
    element.classList.toggle("selected");
    let doseContainer = element.querySelector(".dose-container");

    document.querySelectorAll(".dose-container").forEach(dc => {
        if (dc !== doseContainer) {
            dc.style.display = "none";
        }
    });

    doseContainer.style.display = (doseContainer.style.display === "block") ? "none" : "block";

    let vaccineName = element.childNodes[0].textContent.trim();
    doseContainer.innerHTML = "";

    doses[vaccineName]?.forEach(dose => {
        let doseElement = document.createElement("div");
        doseElement.classList.add("dose-box");
        doseElement.textContent = dose;
        doseElement.onclick = function (event) {
            selectDose(doseElement, event);
        };
        doseContainer.appendChild(doseElement);
    });
}

function selectDose(doseElement, event) {
    let doseContainer = doseElement.parentElement;
    let vaccineBox = doseContainer.parentElement;

    let selectedDoseBox = vaccineBox.querySelector(".selected-dose-box");
    if (!selectedDoseBox) {
        selectedDoseBox = document.createElement("div");
        selectedDoseBox.classList.add("selected-dose-box");
        vaccineBox.appendChild(selectedDoseBox);
    }

    if (selectedDoseBox.children.length === 0) {
        let selectedDoseItem = document.createElement("div");
        selectedDoseItem.classList.add("selected-dose");
        selectedDoseItem.textContent = doseElement.textContent;

        selectedDoseItem.onclick = function () {
            doseContainer.appendChild(doseElement);
            selectedDoseItem.remove();
        };

        selectedDoseBox.appendChild(selectedDoseItem);
        doseElement.remove();
    }

    doseContainer.style.display = "none";
    event.stopPropagation();
}

// ====== إعادة تعيين التحديدات ======
function resetSelections() {
    document.querySelectorAll(".selected-dose-box").forEach(box => box.innerHTML = "");
    document.querySelectorAll(".vaccine-box").forEach(box => box.classList.remove("selected"));
}

// ====== عرض ملخص التطعيمات ======
function showSummary() {
    let summaryBox = document.getElementById("summary");
    summaryBox.innerHTML = "<h3>ملخص البيانات المختارة:</h3>";

    document.querySelectorAll(".vaccine-box").forEach(box => {
        let vaccineName = box.childNodes[0].textContent.trim();
        let doses = [...box.querySelectorAll(".selected-dose")].map(d => d.textContent);
        if (doses.length > 0) {
            summaryBox.innerHTML += `<p><strong>${vaccineName}:</strong> ${doses.join(", ")}</p>`;
        }
    });

    summaryBox.style.display = "block";
    summaryBox.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ====== حفظ بيانات التطعيم ======
function saveData() {
    alert("تم حفظ بيانات التطعيم بنجاح!");
}

// ====== تشغيل الدوال عند تحميل الصفحة ======
window.onload = function () {
    displayChildAge();
};