// 模拟solarToLunar函数
const LunarData = {
    months: ['正','二','三','四','五','六','七','八','九','十','冬','腊'],
    days: ['初一','初二','初三','初四','初五','初六','初七','初八','初九','初十',
           '十一','十二','十三','十四','十五','十六','十七','十八','十九','二十',
           '廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十']
};

function solarToLunar(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    const springFestivals = {
        2025: { month: 1, day: 29 },
        2026: { month: 2, day: 17 },
        2027: { month: 2, day: 6 }
    };
    
    const lunarYearData = {
        2025: { months: [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 30], leapMonth: 0, leapDays: 0 },
        2026: { months: [29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30], leapMonth: 5, leapDays: 30 },
        2027: { months: [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29], leapMonth: 0, leapDays: 0 }
    };
    
    let lunarYear = year;
    let springFestival = springFestivals[year];
    
    if (!springFestival) { console.log('Missing springFestival for year:', year); return null; }
    
    if (month < springFestival.month || (month === springFestival.month && day < springFestival.day)) {
        lunarYear = year - 1;
        springFestival = springFestivals[lunarYear];
    }
    
    const springDate = Date.UTC(lunarYear, springFestival.month - 1, springFestival.day);
    const targetDate = Date.UTC(year, month - 1, day);
    let diffDays = Math.floor((targetDate - springDate) / (24 * 60 * 60 * 1000));
    
    const yearData = lunarYearData[lunarYear] || lunarYearData[2025];
    const monthDays = yearData.months;
    const leapMon = yearData.leapMonth;
    const leapMonDays = yearData.leapDays;
    
    let lunarMonth = 1, lunarDay = 1, isLeap = false;
    let remainingDays = diffDays;
    
    for (let i = 0; i < monthDays.length; i++) {
        if (leapMon > 0 && leapMon === i + 1) {
            if (remainingDays < leapMonDays) {
                lunarMonth = i + 1; lunarDay = remainingDays + 1; isLeap = true; break;
            }
            remainingDays -= leapMonDays;
        }
        if (remainingDays < monthDays[i]) {
            lunarMonth = i + 1; lunarDay = remainingDays + 1; break;
        }
        remainingDays -= monthDays[i];
    }
    
    return {
        year: lunarYear, month: lunarMonth, day: lunarDay, isLeap: isLeap,
        monthName: (isLeap ? '闰' : '') + LunarData.months[lunarMonth - 1] + '月',
        dayName: LunarData.days[lunarDay - 1],
        fullName: (isLeap ? '闰' : '') + LunarData.months[lunarMonth - 1] + '月' + LunarData.days[lunarDay - 1]
    };
}

// 测试2026年4月1-30日
let allOk = true;
for (let d = 1; d <= 30; d++) {
    const result = solarToLunar(new Date(2026, 3, d));
    if (!result || !result.dayName) { 
        console.log('ERROR at 4/' + d + ':', JSON.stringify(result));
        allOk = false;
    }
}

console.log('4月1日:', solarToLunar(new Date(2026, 3, 1)).fullName);
console.log('4月19日:', solarToLunar(new Date(2026, 3, 19)).fullName);
console.log('4月30日:', solarToLunar(new Date(2026, 3, 30)).fullName);
if (allOk) console.log('4月所有日期OK');

// 测试上月末（3月31日）
const mar31 = solarToLunar(new Date(2026, 2, 31));
console.log('3月31日:', mar31 ? mar31.fullName : 'ERROR');
// 测试下月初（5月1日）
const may1 = solarToLunar(new Date(2026, 4, 1));
console.log('5月1日:', may1 ? may1.fullName : 'ERROR');
