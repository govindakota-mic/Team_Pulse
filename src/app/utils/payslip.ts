import { Employee } from '../data/mock-data';

export type Line = [label: string, amount: number];

/** Sample salary split: 50% basic, 20% HRA, rest special allowance. Deductions are illustrative. */
export function computePayslip(e: Employee) {
  const gross = e.monthlySalary;
  const basic = Math.round(gross * 0.5);
  const hra = Math.round(gross * 0.2);
  const earnings: Line[] = [['Basic', basic], ['House rent allowance', hra], ['Special allowance', gross - basic - hra]];
  const deductions: Line[] = [
    ['Provident fund (12% of basic)', Math.round(basic * 0.12)],
    ['Professional tax', 200],
    ['Income tax (TDS)', Math.round(gross * 0.05)],
  ];
  const totalDeductions = deductions.reduce((s, [, n]) => s + n, 0);
  return { earnings, deductions, gross, totalDeductions, net: gross - totalDeductions };
}

const inr = (n: number) => 'Rs. ' + n.toLocaleString('en-IN');

/** month is 'YYYY-MM'. jsPDF is loaded on demand so it stays out of the main bundle. */
export async function downloadPayslip(e: Employee, month: string) {
  const { jsPDF } = await import('jspdf');
  const [y, m] = month.split('-').map(Number);
  const label = new Date(y, m - 1, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const p = computePayslip(e);
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const L = 15, R = 195, MID = 105;

  doc.setFont('helvetica', 'bold').setFontSize(18).text('Team Pulse', L, 20);
  doc.setFont('helvetica', 'normal').setFontSize(10).setTextColor(110).text(`Payslip for ${label}`, L, 27);
  doc.setDrawColor(200).line(L, 32, R, 32);

  doc.setTextColor(30).setFontSize(10);
  const details: [string, string][] = [
    ['Employee', e.name], ['Employee ID', 'TP' + String(e.id).padStart(3, '0')],
    ['Department', e.department], ['Designation', e.role],
    ['Email', e.email], ['Date of joining', e.joinDate],
  ];
  details.forEach(([k, v], i) => {
    const x = i % 2 ? MID : L, yy = 41 + Math.floor(i / 2) * 8;
    doc.setTextColor(110).text(k, x, yy);
    doc.setTextColor(30).text(v, x + 32, yy);
  });

  const table = (title: string, rows: Line[], x: number, w: number, total: [string, number]) => {
    doc.setFont('helvetica', 'bold').setFillColor(238, 240, 255).rect(x, 70, w, 8, 'F').text(title, x + 3, 75.5);
    doc.setFont('helvetica', 'normal');
    rows.forEach(([k, v], i) => {
      doc.text(k, x + 3, 86 + i * 8);
      doc.text(inr(v), x + w - 3, 86 + i * 8, { align: 'right' });
    });
    doc.setDrawColor(200).line(x, 108, x + w, 108);
    doc.setFont('helvetica', 'bold').text(total[0], x + 3, 114).text(inr(total[1]), x + w - 3, 114, { align: 'right' });
  };
  table('Earnings', p.earnings, L, 84, ['Gross earnings', p.gross]);
  table('Deductions', p.deductions, MID + 6, 84, ['Total deductions', p.totalDeductions]);

  doc.setFillColor(79, 70, 229).rect(L, 126, R - L, 14, 'F');
  doc.setTextColor(255).setFontSize(12).text('Net pay', L + 4, 135).text(inr(p.net), R - 4, 135, { align: 'right' });
  doc.setFont('helvetica', 'normal').setFontSize(8).setTextColor(130)
    .text('Computer-generated payslip with sample data. No signature required.', L, 285);

  doc.save(`Payslip_${e.name.replace(/\s+/g, '_')}_${month}.pdf`);
}
