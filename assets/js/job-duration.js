/**
 * Job Duration Calculator
 * Automatically calculates job durations with "present" end date
 * and displays the total period in format: YYYY-MM ~ present (X年YZ月)
 */

document.addEventListener('DOMContentLoaded', function() {
  const jobElements = document.querySelectorAll('.job-duration');
  
  jobElements.forEach(element => {
    const startDate = element.dataset.start;
    const endDate = element.dataset.end;
    
    if (!startDate) return;
    
    // Parse dates
    const [startYear, startMonth] = startDate.split('-').map(Number);
    let endYear, endMonth;
    
    if (endDate === 'present') {
      const now = new Date();
      endYear = now.getFullYear();
      endMonth = now.getMonth() + 1;
    } else {
      [endYear, endMonth] = endDate.split('-').map(Number);
    }
    
    // Calculate duration
    const durationText = calculateDuration(startYear, startMonth, endYear, endMonth);
    
    // Format display - keep "present" as-is
    const displayEndDate = endDate === 'present' ? 'present' : endDate;

    // Range on one line, length of service on the next, so the narrow date
    // column never has to break mid-word.
    element.textContent = `${startDate} ~ ${displayEndDate}`;
    const length = document.createElement('span');
    length.className = 'entry__duration';
    length.textContent = `(${durationText})`;
    element.appendChild(length);
  });
});

function calculateDuration(startYear, startMonth, endYear, endMonth) {
  // 開始日は1日、終了日は月末として計算
  // totalMonths に1を加算して月末を考慮
  const totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
  
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  
  // Format duration string
  let result = '';
  if (years > 0) {
    result += `${years}年`;
  }
  if (months > 0) {
    result += `${months}ヶ月`;
  }
  
  return result || '0ヶ月';
}
