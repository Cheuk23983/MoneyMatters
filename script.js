// --- 1. Compound Interest Calculator & Dynamic Chart
let compoundChart = null;

function calculateCompoundInterest() {
    const startingInput = document.getElementById('ciStartingAmount');
    if (!startingInput) return;

    const P = parseFloat(startingInput.value) || 0;
    const PMT = parseFloat(document.getElementById('ciContribution').value) || 0;
    const r = (parseFloat(document.getElementById('ciInterestRate').value) || 0) / 100;
    const n = parseInt(document.getElementById('ciFrequency').value) || 12;
    const t = parseInt(document.getElementById('ciYears').value) || 1;

    let labels = [];
    let contributedData = [];
    let totalBalanceData = [];

    let currentBalance = P;
    let totalContributed = P;

    labels.push('Year 0');
    contributedData.push(P);
    totalBalanceData.push(P);

    for (let year = 1; year <= t; year++) {
        for (let period = 1; period <= n; period++) {
            currentBalance = (currentBalance + PMT) * (1 + r / n);
            totalContributed += PMT;
        }
        labels.push('Year ' + year);
        contributedData.push(Math.round(totalContributed));
        totalBalanceData.push(Math.round(currentBalance));
    }

    const totalInterest = currentBalance - totalContributed;

    const fmt = (num) => '$' + num.toLocaleString('en-NZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    document.getElementById('ciOutContributed').textContent = fmt(totalContributed);
    document.getElementById('ciOutInterest').textContent = fmt(totalInterest);
    document.getElementById('ciOutTotal').textContent = fmt(currentBalance);

    // Render or update Chart Diagram
    const chartCanvas = document.getElementById('compoundChart');
    if (chartCanvas) {
        const ctx = chartCanvas.getContext('2d');
        
        if (compoundChart) {
            compoundChart.destroy();
        }

        compoundChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Total Balance (With Interest)',
                        data: totalBalanceData,
                        borderColor: '#2563eb',
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        fill: true,
                        tension: 0.3
                    },
                    {
                        label: 'Total Money Contributed',
                        data: contributedData,
                        borderColor: '#dc2626',
                        borderDash: [5, 5],
                        fill: false,
                        tension: 0
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        ticks: {
                            callback: (val) => '$' + val.toLocaleString()
                        }
                    }
                }
            }
        });
    }
}

// Bind Compound Interest Events
const ciBtn = document.getElementById('ciCalculateBtn');
if (ciBtn) {
    ciBtn.addEventListener('click', calculateCompoundInterest);
}

// --- 2. Saving Goal Planner ---
function calculateSavingGoal() {
    const targetInput = document.getElementById('goalAmount');
    if (!targetInput) return;

    const target = parseFloat(targetInput.value) || 0;
    const saved = parseFloat(document.getElementById('goalSaved').value) || 0;
    const timeframe = parseFloat(document.getElementById('goalTimeframe').value) || 1;
    const unit = document.getElementById('goalTimeType').value;

    const remaining = Math.max(0, target - saved);

    let totalMonths = timeframe;
    if (unit === 'weeks') totalMonths = timeframe / 4.33;
    if (unit === 'years') totalMonths = timeframe * 12;

    const monthlySaving = remaining / Math.max(totalMonths, 1);

    const fmt = (num) => '$' + num.toLocaleString('en-NZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const formattedTimeText = (() => {
        const months = Math.max(1, Math.round(totalMonths));
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;

        if (years > 0 && remainingMonths > 0) {
            return `${years} ${years === 1 ? 'year' : 'years'}, ${remainingMonths} ${remainingMonths === 1 ? 'Month' : 'Months'}`;
        }

        if (years > 0) {
            return `${years} ${years === 1 ? 'year' : 'years'}`;
        }

        return `${months} Months`;
    })();

    document.getElementById('outGoalTimeText').textContent = formattedTimeText;
    document.getElementById('goalRemaining').textContent = fmt(remaining);
    document.getElementById('goalMonthly').textContent = fmt(monthlySaving);
}

// Bind Goal Planner Events
const goalBtn = document.getElementById('goalCalculateBtn');
if (goalBtn) {
    goalBtn.addEventListener('click', calculateSavingGoal);
}

if (document.getElementById('ciCalculateBtn')) {
    calculateCompoundInterest();
}
if (document.getElementById('goalCalculateBtn')) {
    calculateSavingGoal();
}

// --- 3. Budget Tool Calculator ---
let budgetChart = null;

function calculateBudget() {
    const incomeInput = document.getElementById('totalTakeHome');
    if (!incomeInput) return;

    const income = parseFloat(incomeInput.value) || 0;

    const needRent = parseFloat(document.getElementById('needRent').value) || 0;
    const needFood = parseFloat(document.getElementById('needFood').value) || 0;
    const needTransport = parseFloat(document.getElementById('needTransport').value) || 0;
    const needPhone = parseFloat(document.getElementById('needPhone').value) || 0;
    const needOthers = parseFloat(document.getElementById('needOthers').value) || 0;

    const totalNeeds = needRent + needFood + needTransport + needPhone + needOthers;

    const wantEntertainment = parseFloat(document.getElementById('wantEntertainment').value) || 0;
    const wantTakeout = parseFloat(document.getElementById('wantTakeout').value) || 0;
    const wantShopping = parseFloat(document.getElementById('wantShopping').value) || 0;
    const wantSubscriptions = parseFloat(document.getElementById('wantSubscriptions').value) || 0;
    const wantOthers = parseFloat(document.getElementById('wantOthers').value) || 0;

    const totalWants = wantEntertainment + wantTakeout + wantShopping + wantSubscriptions + wantOthers;

    const totalSavings = parseFloat(document.getElementById('savingGoal').value) || 0;

    const netBalance = income - (totalNeeds + totalWants + totalSavings);

    const fmt = (num) => '$' + num.toLocaleString('en-NZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '/mth';

    document.getElementById('outBudgetIncome').textContent = fmt(income);
    document.getElementById('outBudgetNeeds').textContent = fmt(totalNeeds);
    document.getElementById('outBudgetWants').textContent = fmt(totalWants);
    document.getElementById('outBudgetSavings').textContent = fmt(totalSavings);
    document.getElementById('outBudgetLeftover').textContent = fmt(netBalance);

    const chartCanvas = document.getElementById('budgetDoughnutChart');
    if (chartCanvas && typeof Chart !== 'undefined') {
        const ctx = chartCanvas.getContext('2d');
        if (budgetChart) {
            budgetChart.destroy();
        }

        budgetChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Needs', 'Wants', 'Savings'],
                datasets: [{
                    data: [totalNeeds, totalWants, totalSavings],
                    backgroundColor: [
                        '#CF0000',
                        '#009024',
                        '#FFD943'
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: {
                                family: 'Gantari',
                                size: 13
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let val = context.raw || 0;
                                let pct = income > 0 ? ((val / income) * 100).toFixed(1) : 0;
                                return ` ${context.label}: $${val.toLocaleString()} (${pct}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
}

const budgetBtn = document.getElementById('budgetCalculateBtn');
if (budgetBtn) {
    budgetBtn.addEventListener('click', calculateBudget);
    calculateBudget();
}

// --- 4. Paycheck Tax Calculator ---
function calculateNZIncomeTax(annualIncome) {
    let tax = 0;

    if (annualIncome > 180000) {
        tax += (annualIncome - 180000) * 0.39;
        annualIncome = 180000;
    }
    if (annualIncome > 78100) {
        tax += (annualIncome - 78100) * 0.33;
        annualIncome = 78100;
    }
    if (annualIncome > 53500) {
        tax += (annualIncome - 53500) * 0.30;
        annualIncome = 53500;
    }
    if (annualIncome > 15600) {
        tax += (annualIncome - 15600) * 0.175;
        annualIncome = 15600;
    }
    if (annualIncome > 0) {
        tax += annualIncome * 0.105;
    }

    return tax;
}

function formatCurrency(value) {
    return '$' + Number(value).toLocaleString('en-NZ', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function runPaycheckCalculator() {
    const incomeInput = document.getElementById('incomeInput');
    const payFrequency = document.getElementById('payFrequency');
    const taxCode = document.getElementById('taxCode');
    const kiwisaverRate = document.getElementById('kiwisaverRate');

    if (!incomeInput || !payFrequency || !taxCode || !kiwisaverRate) {
        return;
    }

    const incomeValue = parseFloat(incomeInput.value) || 0;
    const frequency = payFrequency.value;
    const taxCodeValue = taxCode.value;
    const ksRate = parseFloat(kiwisaverRate.value) || 0;

    if (incomeValue <= 0) {
        document.getElementById('outGross').textContent = '$0.00';
        document.getElementById('outPAYE').textContent = '$0.00';
        document.getElementById('outKiwiSaver').textContent = '$0.00';
        document.getElementById('outTakeHome').textContent = '$0.00';
        return;
    }

    let annualGross = 0;
    let payPeriodsPerYear = 52;

    if (frequency === 'weekly') {
        annualGross = incomeValue * 52;
        payPeriodsPerYear = 52;
    } else if (frequency === 'fortnightly') {
        annualGross = incomeValue * 26;
        payPeriodsPerYear = 26;
    } else if (frequency === 'annually') {
        annualGross = incomeValue;
        payPeriodsPerYear = 1;
    }

    let annualTax = calculateNZIncomeTax(annualGross);

    if (taxCodeValue === 'M_SL' && annualGross > 24128) {
        annualTax += (annualGross - 24128) * 0.12;
    }

    const annualKiwiSaver = annualGross * ksRate;
    const annualTakeHome = annualGross - annualTax - annualKiwiSaver;

    const grossPerPeriod = annualGross / payPeriodsPerYear;
    const taxPerPeriod = annualTax / payPeriodsPerYear;
    const ksPerPeriod = annualKiwiSaver / payPeriodsPerYear;
    const takeHomePerPeriod = annualTakeHome / payPeriodsPerYear;

    document.getElementById('outGross').textContent = formatCurrency(grossPerPeriod);
    document.getElementById('outPAYE').textContent = formatCurrency(taxPerPeriod);
    document.getElementById('outKiwiSaver').textContent = formatCurrency(ksPerPeriod);
    document.getElementById('outTakeHome').textContent = formatCurrency(takeHomePerPeriod);
}

function setupPaycheckCalculator() {
    const calculateBtn = document.getElementById('calculateBtn');
    if (!calculateBtn) return;

    calculateBtn.addEventListener('click', runPaycheckCalculator);

    ['input', 'change'].forEach((eventType) => {
        const fields = [
            document.getElementById('incomeInput'),
            document.getElementById('payFrequency'),
            document.getElementById('taxCode'),
            document.getElementById('kiwisaverRate')
        ].filter(Boolean);

        fields.forEach((field) => {
            field.addEventListener(eventType, runPaycheckCalculator);
        });
    });

    runPaycheckCalculator();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupPaycheckCalculator);
} else {
    setupPaycheckCalculator();
}