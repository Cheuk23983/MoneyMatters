// --- Search bar toggle and expand animation ---
// This controls the clickable search icon and the expandable search box in the header.
const searchContainer = document.getElementById('searchContainer');
const searchToggleBtn = document.getElementById('searchToggleBtn');

if (searchContainer && searchToggleBtn) {
    // Find the actual input and toggle the open/closed state of the search box.
    const searchInput = searchContainer.querySelector('.expandable-search-input');

    searchToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        searchContainer.classList.toggle('active');

        if (searchContainer.classList.contains('active') && searchInput) {
            searchInput.focus();
        }
    });

    // Close the search box if the user clicks somewhere else on the page.
    document.addEventListener('click', (e) => {
        if (!searchContainer.contains(e.target)) {
            searchContainer.classList.remove('active');
        }
    });
}

// --- FAQ accordion behaviour ---
// This makes only one FAQ item stay open at a time on the homepage and other pages.
// Select every FAQ item and keep only one open at the same time for a cleaner layout.
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach((faqItem) => {
    faqItem.addEventListener('toggle', () => {
        if (!faqItem.open) return;

        faqItems.forEach((otherItem) => {
            if (otherItem !== faqItem) {
                otherItem.open = false;
            }
        });
    });
});

// --- Footer details responsive state ---
// This keeps the footer dropdowns open on desktop and closed on mobile layouts.
function syncFooterDetailsState() {
    // Keep footer accordions open on desktop and collapsed on mobile for better responsiveness.
    const footerDetails = document.querySelectorAll('.site-map.footer-details, .tool-map.footer-details');
    if (!footerDetails.length) return;

    const isDesktop = window.innerWidth >= 1024;

    footerDetails.forEach((detail) => {
        detail.open = isDesktop;
    });
}

window.addEventListener('resize', syncFooterDetailsState);
window.addEventListener('DOMContentLoaded', syncFooterDetailsState);
syncFooterDetailsState();


// --- Homepage jargon search ---
// This matches the complete Support Hub glossary and links to the filtered glossary entry.
function setupHomeJargonSearch() {
    const searchInput = document.getElementById('homeJargonSearchInput');
    const searchStatus = document.getElementById('homeJargonSearchStatus');

    if (!searchInput) return;

    const updateSearchStatus = () => {
        const query = normalizeSearchText(searchInput.value);
        const matches = findGlossaryMatches(query);

        if (searchStatus) {
            searchStatus.textContent = query && !matches.length ? 'Word not found' : '';
            searchStatus.classList.toggle('visible', Boolean(query && !matches.length));
        }

        return matches;
    };

    searchInput.addEventListener('input', updateSearchStatus);
    searchInput.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter') return;

        const matches = updateSearchStatus();
        if (matches.length) {
            window.location.href = `support_hub.html#${matches[0].slug}`;
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupHomeJargonSearch);
} else {
    setupHomeJargonSearch();
}

// --- Home page jargon pills redirect ---
// This sends a clicked term from the homepage to the support hub glossary and opens that item.
// Redirect each slogan pill click to the support hub glossary and open that definition.
const homePagePills = document.querySelectorAll('.pill[data-term]');
homePagePills.forEach((pill) => {
    pill.addEventListener('click', () => {
        const targetTerm = pill.dataset.term;
        if (!targetTerm) return;
        window.location.href = `support_hub.html#${targetTerm}`;
    });
});


// --- PAYE calculator ---
// This estimates the income tax and take-home pay based on income and tax settings.
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

// --- PAYE calculator ---
// This estimates the income tax and take-home pay based on income and tax settings.
function calculateNZIncomeTax(annualIncome) {
    // Use NZ tax brackets so the estimated PAYE matches the standard progressive tax schedule.
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
    // Keep currency output consistent across the tax and pay results.
    return '$' + Number(value).toLocaleString('en-NZ', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// --- Paycheck calculation logic ---
// This calculates gross pay, tax, KiwiSaver, and take-home pay for each pay cycle.
function runPaycheckCalculator() {
    const incomeInput = document.getElementById('incomeInput');
    const payFrequency = document.getElementById('payFrequency');
    const taxCode = document.getElementById('taxCode');
    const kiwisaverRate = document.getElementById('kiwisaverRate');

    if (!incomeInput || !payFrequency || !taxCode || !kiwisaverRate) {
        return;
    }

    // Convert the entered pay details into numbers so the calculator can do the tax maths.
    const incomeValue = parseFloat(incomeInput.value) || 0;
    const frequency = payFrequency.value;
    const taxCodeValue = taxCode.value;
    const ksRate = parseFloat(kiwisaverRate.value) || 0;

    // If no income is entered, return zero values so the outputs do not show invalid data.
    if (incomeValue <= 0) {
        document.getElementById('outGross').textContent = '$0.00';
        document.getElementById('outPAYE').textContent = '$0.00';
        document.getElementById('outKiwiSaver').textContent = '$0.00';
        document.getElementById('outTakeHome').textContent = '$0.00';
        return;
    }

    // Convert the selected pay frequency into an annual income value and number of pay periods.
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

    // Work out the annual PAYE using the tax brackets and apply any special tax code rules.
    let annualTax = calculateNZIncomeTax(annualGross);

    if (taxCodeValue === 'M_SL' && annualGross > 24128) {
        annualTax += (annualGross - 24128) * 0.12;
    }

    // Calculate the expected KiwiSaver deduction and the remaining net income after tax and savings.
    const annualKiwiSaver = annualGross * ksRate;
    const annualTakeHome = annualGross - annualTax - annualKiwiSaver;

    const grossPerPeriod = annualGross / payPeriodsPerYear;
    const taxPerPeriod = annualTax / payPeriodsPerYear;
    const ksPerPeriod = annualKiwiSaver / payPeriodsPerYear;
    const takeHomePerPeriod = annualTakeHome / payPeriodsPerYear;

    // Update the results panel with the per-pay-period values for each category.
    document.getElementById('outGross').textContent = formatCurrency(grossPerPeriod);
    document.getElementById('outPAYE').textContent = formatCurrency(taxPerPeriod);
    document.getElementById('outKiwiSaver').textContent = formatCurrency(ksPerPeriod);
    document.getElementById('outTakeHome').textContent = formatCurrency(takeHomePerPeriod);
}

// --- Paycheck calculator setup ---
// This wires up the calculator so results update only after the button is clicked.
function setupPaycheckCalculator() {
    // Listen only for the calculate button so typing does not change the results.
    const calculateBtn = document.getElementById('calculateBtn');
    if (!calculateBtn) return;

    calculateBtn.addEventListener('click', runPaycheckCalculator);
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupPaycheckCalculator);
} else {
    setupPaycheckCalculator();
}


// --- Compound interest calculator ---
// This calculates the growing balance and draws the compound interest chart.
let compoundChart = null;

// This function reads the starting amount, contribution, interest rate, and time period,
// then calculates the future balance and interest earned over time.
function calculateCompoundInterest() {
    const startingInput = document.getElementById('ciStartingAmount');
    if (!startingInput) return;

    // Read the user inputs and convert them to numbers so the calculation can run.
    const P = parseFloat(startingInput.value) || 0;
    const PMT = parseFloat(document.getElementById('ciContribution').value) || 0;
    const r = (parseFloat(document.getElementById('ciInterestRate').value) || 0) / 100;
    const n = parseInt(document.getElementById('ciFrequency').value) || 12;
    const t = parseInt(document.getElementById('ciYears').value) || 1;

    // Store the yearly labels and values so the chart can be drawn step by step.
    let labels = [];
    let contributedData = [];
    let totalBalanceData = [];

    // Start with the initial balance and keep track of the total money actually contributed.
    let currentBalance = P;
    let totalContributed = P;

    labels.push('Year 0');
    contributedData.push(P);
    totalBalanceData.push(P);

    // Repeat the compounding process for each year and each compounding period.
    for (let year = 1; year <= t; year++) {
        for (let period = 1; period <= n; period++) {
            // Add the regular contribution and apply compound growth for that period.
            currentBalance = (currentBalance + PMT) * (1 + r / n);
            totalContributed += PMT;
        }
        labels.push('Year ' + year);
        contributedData.push(Math.round(totalContributed));
        totalBalanceData.push(Math.round(currentBalance));
    }

    // Work out how much of the final value is interest earned rather than money saved.
    const totalInterest = currentBalance - totalContributed;

    // Format the numbers as NZ dollars so the results are easy to read.
    const fmt = (num) => '$' + num.toLocaleString('en-NZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    // Update the result text on the page with the final totals.
    document.getElementById('ciOutContributed').textContent = fmt(totalContributed);
    document.getElementById('ciOutInterest').textContent = fmt(totalInterest);
    document.getElementById('ciOutTotal').textContent = fmt(currentBalance);

    // Render or update Chart Diagram
    // Draw or redraw the chart so the user can see the growth over time.
    const chartCanvas = document.getElementById('compoundChart');
    if (chartCanvas) {
        const ctx = chartCanvas.getContext('2d');

        // Destroy the old chart before making a new one so it does not overlap.
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

// --- Compound interest button event ---
// This attaches the calculate button to the compound interest function.
const ciBtn = document.getElementById('ciCalculateBtn');
if (ciBtn) {
    ciBtn.addEventListener('click', calculateCompoundInterest);
}


// --- Saving goal planner ---
// This works out how much needs to be saved each month to reach a goal.
function calculateSavingGoal() {
    const targetInput = document.getElementById('goalAmount');
    if (!targetInput) return;

    // Read the goal amount, current savings, and time frame so the planner can calculate the monthly target.
    const target = parseFloat(targetInput.value) || 0;
    const saved = parseFloat(document.getElementById('goalSaved').value) || 0;
    const timeframe = parseFloat(document.getElementById('goalTimeframe').value) || 1;
    const unit = document.getElementById('goalTimeType').value;

    // Work out how much is left to save before the goal is reached.
    const remaining = Math.max(0, target - saved);

    // Convert the time period into months so the savings target is consistent.
    let totalMonths = timeframe;
    if (unit === 'weeks') totalMonths = timeframe / 4.33;
    if (unit === 'years') totalMonths = timeframe * 12;

    // Work out the amount that needs to be saved each month to hit the target.
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

    // Update the page with the calculated time and monthly savings needed.
    document.getElementById('outGoalTimeText').textContent = formattedTimeText;
    document.getElementById('goalRemaining').textContent = fmt(remaining);
    document.getElementById('goalMonthly').textContent = fmt(monthlySaving);
}

// --- Saving goal button event ---
// This attaches the calculate button to the goal planner function.
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


// --- Budget tool calculator ---
// This calculates needs, wants, savings, and draws the budget doughnut chart.
let budgetChart = null;

function calculateBudget() {
    const incomeInput = document.getElementById('totalTakeHome');
    if (!incomeInput) return;

    // Read the monthly income and all spending categories before calculating the budget split.
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

    // Add the savings goal to the total spending so the leftover amount can be calculated.
    const totalSavings = parseFloat(document.getElementById('savingGoal').value) || 0;

    // Calculate the remaining money after needs, wants, and savings are covered.
    const netBalance = income - (totalNeeds + totalWants + totalSavings);

    // Format the amounts as monthly NZ dollars for the result cards.
    const fmt = (num) => '$' + num.toLocaleString('en-NZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '/mth';

    // Fill in the budget summary cards with the calculated results.
    document.getElementById('outBudgetIncome').textContent = fmt(income);
    document.getElementById('outBudgetNeeds').textContent = fmt(totalNeeds);
    document.getElementById('outBudgetWants').textContent = fmt(totalWants);
    document.getElementById('outBudgetSavings').textContent = fmt(totalSavings);
    document.getElementById('outBudgetLeftover').textContent = fmt(netBalance);

    // Build the doughnut chart using the totals from the budget breakdown.
    const chartCanvas = document.getElementById('budgetDoughnutChart');
    if (chartCanvas && typeof Chart !== 'undefined') {
        const ctx = chartCanvas.getContext('2d');
        if (budgetChart) {
            budgetChart.destroy();
        }

        // Normalise the three budget categories so the doughnut always totals 100%.
        const hasAnyBudgetValue = totalNeeds > 0 || totalWants > 0 || totalSavings > 0 || income > 0;
        const totalAllocated = totalNeeds + totalWants + totalSavings;
        const chartData = hasAnyBudgetValue && totalAllocated > 0
            ? [
                (totalNeeds / totalAllocated) * 100,
                (totalWants / totalAllocated) * 100,
                (totalSavings / totalAllocated) * 100
            ]
            : [1, 1, 1];

        budgetChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Needs', 'Wants', 'Savings'],
                datasets: [{
                    data: chartData,
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
                                const valPercent = context.raw || 0;
                                const amount = totalAllocated > 0 ? totalAllocated * (valPercent / 100) : 0;
                                return ` ${context.label}: $${amount.toLocaleString('en-NZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${valPercent.toFixed(1)}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
}

// --- Budget button event ---
// This runs the budget calculator when the user clicks the button.
const budgetBtn = document.getElementById('budgetCalculateBtn');
if (budgetBtn) {
    budgetBtn.addEventListener('click', calculateBudget);
    calculateBudget();
}


// --- Debt growth simulator ---
// This calculates how long debt takes to repay and shows the debt growth chart.
let debtChart = null;

function calculateDebtGrowth() {
    const debtInput = document.getElementById('startingDebts');
    if (!debtInput) return;

    // Read the debt amount, interest rate, and repayment amount before simulating the debt timeline.
    const startingDebt = parseFloat(debtInput.value) || 0;
    const annualRate = (parseFloat(document.getElementById('interestRate').value) || 0) / 100;
    const monthlyRepayment = parseFloat(document.getElementById('monthlyRepayment').value) || 0;

    // Create a helper for showing money values in a consistent currency format.
    const fmtCurrency = (value) => '$' + Number(value).toLocaleString('en-NZ', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    const formatRepayTime = (months) => {
        if (months <= 0) return '0 months';
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;

        if (years === 0) return `${months} month${months === 1 ? '' : 's'}`;
        if (remainingMonths === 0) return `${years} year${years === 1 ? '' : 's'}`;
        return `${years} year${years === 1 ? '' : 's'}, ${remainingMonths} month${remainingMonths === 1 ? '' : 's'}`;
    };

    // If no debt is entered, show a blank default result instead of a broken calculation.
    if (startingDebt <= 0) {
        document.getElementById('outDebtRepayTime').textContent = '0 months';
        document.getElementById('outDebtTotalPaid').textContent = '$0.00';
        document.getElementById('outDebtInterest').textContent = '$0.00';

        const chartCanvas = document.getElementById('debtGrowthChart');
        if (chartCanvas && typeof Chart !== 'undefined') {
            const ctx = chartCanvas.getContext('2d');
            if (debtChart) debtChart.destroy();
            debtChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Month 0'],
                    datasets: [{
                        label: 'Debt Balance',
                        data: [0],
                        borderColor: '#2563eb',
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        tension: 0.3,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: (value) => '$' + Number(value).toLocaleString()
                            }
                        }
                    }
                }
            });
        }
        return;
    }

    // Simulate month by month so the debt balance, total paid, and interest can be tracked.
    let balance = startingDebt;
    let totalPaid = 0;
    let totalInterest = 0;
    let months = 0;
    const maxMonths = 600;
    const labels = ['Month 0'];
    const balances = [startingDebt];

    while (balance > 0 && months < maxMonths) {
        // Add interest first, then subtract the monthly repayment to model real debt behaviour.
        const interest = balance * (annualRate / 12);
        balance += interest;
        totalInterest += interest;

        let repayment = monthlyRepayment;
        if (repayment <= 0) {
            repayment = 0;
        }

        if (repayment > 0) {
            balance -= repayment;
            totalPaid += repayment;
        } else {
            totalPaid += 0;
        }

        if (balance < 0) {
            balance = 0;
        }

        months += 1;
        labels.push(`Month ${months}`);
        balances.push(balance);
    }

    // Show the repayment time or a warning if the debt would take too long to clear.
    if (balance > 0) {
        document.getElementById('outDebtRepayTime').textContent = 'More than 50 years';
    } else {
            document.getElementById('outDebtRepayTime').textContent = formatRepayTime(months);
    }

    // Update the output cards with the total amount paid and interest charged.
    document.getElementById('outDebtTotalPaid').textContent = fmtCurrency(totalPaid);
    document.getElementById('outDebtInterest').textContent = fmtCurrency(totalInterest);

    // Plot the debt balance across the simulated months to visualise the repayment trend.
    const chartCanvas = document.getElementById('debtGrowthChart');
    if (chartCanvas && typeof Chart !== 'undefined') {
        const ctx = chartCanvas.getContext('2d');
        if (debtChart) debtChart.destroy();

        const sampledLabels = labels.length > 24 ? labels.filter((_, index) => index % Math.ceil(labels.length / 24) === 0 || index === labels.length - 1) : labels;
        const sampledBalances = labels.length > 24 ? balances.filter((_, index) => index % Math.ceil(balances.length / 24) === 0 || index === balances.length - 1) : balances;

        debtChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: sampledLabels,
                datasets: [{
                    label: 'Debt Balance',
                    data: sampledBalances,
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.08)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: (value) => '$' + Number(value).toLocaleString()
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}

// --- Debt simulator button event ---
// This attaches the debt calculator button and runs the debt simulation.
const debtBtn = document.getElementById('calculateDebtsBtn');
if (debtBtn) {
    debtBtn.addEventListener('click', calculateDebtGrowth);
    calculateDebtGrowth();
}


// --- Support hub FAQ active state ---
// This adds the highlight styling when a support hub FAQ item is opened.
// Give the support hub FAQ cards a highlighted active state when they are opened.
const supportHubFaqItems = document.querySelectorAll('.faq-list.support-hub .faq-item');
supportHubFaqItems.forEach((faqItem) => {
    const summary = faqItem.querySelector('summary');
    const answer = faqItem.querySelector('.faq-answer');

    if (!summary) return;

    const syncSupportFaqState = () => {
        supportHubFaqItems.forEach((otherItem) => {
            const otherSummary = otherItem.querySelector('summary');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            const isOpen = otherItem.open;

            if (otherSummary) {
                otherSummary.classList.toggle('active', isOpen);
            }

            if (otherAnswer) {
                otherAnswer.classList.toggle('active', isOpen);
            }
        });
    };

    faqItem.addEventListener('toggle', syncSupportFaqState);
    summary.addEventListener('click', () => {
        setTimeout(syncSupportFaqState, 0);
    });

    if (faqItem.open && answer) {
        summary.classList.add('active');
        answer.classList.add('active');
    }
});


// --- Support Hub jargon search ---
// This checks the glossary items against the user's search and shows a fallback message when nothing matches.
const glossaryTerms = [
    { slug: 'paye', name: 'PAYE' },
    { slug: 'payslip', name: 'Payslip' },
    { slug: 'tax-bracket', name: 'Tax Bracket' },
    { slug: 'apr', name: 'APR' },
    { slug: 'gross-pay', name: 'Gross Pay' },
    { slug: 'net-pay', name: 'Net Pay' },
    { slug: 'budget', name: 'Budget' },
    { slug: 'principal', name: 'Principal' },
    { slug: 'kiwisaver', name: 'KiwiSaver' },
    { slug: 'interest', name: 'Interest' },
    { slug: 'compound-interest', name: 'Compound Interest' },
    { slug: 'credit', name: 'Credit' },
    { slug: 'debts', name: 'Debt' }
];

function normalizeSearchText(value) {
    return String(value || '')
        .toLowerCase()
        .replace(/&/g, ' and ')
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function findGlossaryMatches(query, items = glossaryTerms) {
    const normalizedQuery = normalizeSearchText(query);
    if (!normalizedQuery) return [];

    return items.filter((item) => {
        const searchableText = item.name
            ? `${item.slug} ${item.name}`
            : `${item.dataset?.term || ''} ${item.querySelector('h4')?.textContent || ''} ${item.textContent || ''}`;

        return normalizeSearchText(searchableText).includes(normalizedQuery);
    });
}

function setupSupportHubJargonSearch() {
    const searchInput = document.getElementById('jargonSearchInput');
    const jargonItems = Array.from(document.querySelectorAll('.jargon-item'));
    const searchStatus = document.getElementById('jargonSearchStatus');
    const jargonList = document.querySelector('.jargon-list');
    const jargonContainer = document.querySelector('.jargon-container.support-hub');

    if (!searchInput || !jargonItems.length || !jargonList || !jargonContainer) {
        return;
    }

    const updateSearchResults = () => {
        const query = normalizeSearchText(searchInput.value);

        if (!query) {
            jargonItems.forEach((item) => {
                item.style.display = 'flex';
            });

            if (searchStatus) {
                searchStatus.textContent = '';
                searchStatus.classList.remove('visible');
            }
            return;
        }

        const matches = findGlossaryMatches(query, jargonItems);

        jargonItems.forEach((item) => {
            const matchesQuery = matches.includes(item);
            item.style.display = matchesQuery ? 'flex' : 'none';
        });

        if (searchStatus) {
            searchStatus.textContent = matches.length ? '' : 'Word not found';
            searchStatus.classList.toggle('visible', !matches.length);
        }

        if (jargonList) {
            jargonList.open = true;
        }
    };

    searchInput.addEventListener('input', updateSearchResults);

    document.addEventListener('click', (event) => {
        if (!jargonContainer.contains(event.target)) {
            jargonList.open = false;
        }
    });

    updateSearchResults();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupSupportHubJargonSearch);
} else {
    setupSupportHubJargonSearch();
}

// This turns glossary terms into a slug and opens the matching definition on the support hub page.
function slugifyTerm(term) {
    // Convert the glossary term into a safe id, so it can match the page section correctly.
    return String(term || '')
        .trim()
        .toLowerCase()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function openJargonTerm(term) {
    // Open the matching jargon item and scroll to it when a term is clicked or linked from another page.
    if (!term) return;

    const slug = slugifyTerm(term);
    const jargonList = document.querySelector('.jargon-list');
    const targetItem = document.getElementById(slug) || document.querySelector(`[data-term="${slug}"]`);

    if (!targetItem) return;

    if (jargonList) {
        jargonList.open = true;
    }

    const searchInput = document.getElementById('jargonSearchInput');
    if (searchInput) {
        searchInput.value = term.replace(/-/g, ' ');
        searchInput.dispatchEvent(new Event('input'));
    }

    targetItem.classList.add('active');
    targetItem.scrollIntoView({ behavior: 'smooth', block: 'center' });

    setTimeout(() => {
        targetItem.classList.remove('active');
    }, 1800);
}

// This checks the URL hash and opens the matching glossary item when the support hub page loads.
if (window.location.pathname.includes('support_hub.html')) {
    // Check the URL hash and open the matching glossary item when the support hub page loads.
    const hashTerm = window.location.hash.replace('#', '');
    if (hashTerm) {
        window.addEventListener('DOMContentLoaded', () => openJargonTerm(hashTerm));
    }
}

// --- Back to top button ---
// This shows the floating button after the page has been scrolled down and scrolls back to the top when clicked.
const backToTopBtn = document.getElementById('backToTopBtn');

if (backToTopBtn) {
    const toggleBackToTopButton = () => {
        if (window.scrollY > 250) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    };

    window.addEventListener('scroll', toggleBackToTopButton, { passive: true });
    toggleBackToTopButton();

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
