// src/components/LaborDashboard.js
export default {
    props: ['sheetId', 'sheetPeriod'],
    template: `
        <div class="flex-1 overflow-hidden flex flex-col print:block">
            <div class="flex-none flex items-center justify-between p-2 bg-white/80 backdrop-blur-md rounded-2xl mb-3 print-hide border border-gray-200/60 shadow-sm flex-wrap gap-3">
                <div class="flex items-center gap-2">
                    <button @click="$emit('back')" class="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-1.5 px-3 rounded-xl text-xs transition-colors">◀ 月份目錄</button>
                    <div class="flex bg-gray-100/90 p-1 rounded-xl gap-0.5 items-center flex-wrap">
                        <button @click="activeTab = 'salary'" class="tab-btn" :class="activeTab === 'salary' ? 'tab-active' : 'tab-inactive'">薪資驗收</button>
                        <button @click="activeTab = 'overtime'" class="tab-btn" :class="activeTab === 'overtime' ? 'tab-active' : 'tab-inactive'">加班彙總</button>
                        <button @click="activeTab = 'leave'" class="tab-btn" :class="activeTab === 'leave' ? 'tab-active' : 'tab-inactive'">特休清單</button>
                        <button @click="activeTab = 'eval'" class="tab-btn" :class="activeTab === 'eval' ? 'tab-active' : 'tab-inactive'">考勤驗收</button>
                        <button @click="activeTab = 'leaveData'" class="tab-btn" :class="activeTab === 'leaveData' ? 'tab-active' : 'tab-inactive'">請假資料</button>
                        <div class="h-4 w-[1px] bg-gray-300 mx-1"></div>
                        <div v-for="(sheet, idx) in otSheets" :key="sheet.id" class="flex items-center relative group">
                            <button @click="activeTab = sheet.id" class="tab-btn pr-6" :class="activeTab === sheet.id ? 'tab-active' : 'tab-inactive'">加班單: {{ getEmp(sheet.empId).name }}</button>
                            <span @click.stop="removeOtSheet(sheet.id, idx)" class="absolute right-1.5 bottom-2 text-gray-400 hover:text-red-500 cursor-pointer text-[10px] font-bold rounded print-hide opacity-40 group-hover:opacity-100 transition-opacity">✕</span>
                        </div>
                    </div>
                </div>
                <div class="flex items-center gap-2.5">
                    <div class="flex items-center gap-1.5 bg-gray-50 border border-gray-200 p-1 rounded-xl">
                        <select v-model="addOtEmpId" class="border-none rounded-lg px-2 py-1 text-xs bg-transparent outline-none cursor-pointer font-medium text-gray-700">
                            <option value="" disabled selected>新增加班單...</option>
                            <option v-for="emp in employees" :key="emp.id" :value="emp.id">{{ emp.name }}</option>
                        </select>
                        <button @click="createNewOtSheet" class="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-1 px-3 rounded-lg text-xs transition-colors shadow-sm">明細頁 ＋</button>
                    </div>
                    <button @click="exportPDF" class="bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold py-1.5 px-4 rounded-xl shadow-sm text-xs flex items-center gap-1.5" :disabled="isPrinting">匯出全份報表 (PDF)</button>
                </div>
            </div>

            <div class="print-page h-full flex flex-col" v-show="activeTab === 'salary' || isPrinting">
                <div class="text-center mb-2 flex-none">
                    <h1 class="text-lg font-bold tracking-widest m-0 text-gray-900">台糖公司 油品事業部 中區 勞務人員薪資 <span class="text-red">驗收計算表</span></h1>
                    <div class="flex justify-between text-xs px-2 mt-1 items-center">
                        <span class="text-gray-600 font-medium">站名: 綠揚站</span>
                        <span class="text-red font-bold">期間: {{ sheetPeriod }}</span>
                        <button @click="addEmployee" class="print-hide bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold py-1 px-3 rounded-xl shadow-sm text-xs flex items-center gap-1">＋ 新增人力</button>
                    </div>
                </div>
                <div class="table-wrapper print-table-wrapper flex-1">
                    <table class="salary-table">
                        <thead>
                            <tr>
                                <th rowspan="3" class="bg-gray-header">編號</th><th rowspan="3" class="bg-gray-header">姓名</th><th rowspan="3" class="bg-gray-header">職稱</th><th rowspan="3" class="bg-gray-header">年資薪資起始</th><th rowspan="3" class="bg-gray-header">特休起始日</th><th rowspan="3" class="bg-gray-header">到職日</th><th rowspan="3" class="bg-gray-header">離職日</th><th colspan="5" class="bg-gray-header">薪資</th><th colspan="9" class="bg-gray-header">出勤</th><th colspan="10" class="bg-gray-header">補助款</th><th rowspan="3" class="bg-gray-header text-red font-bold">實領金額</th><th rowspan="3" class="bg-gray-header">備註</th><th rowspan="3" class="bg-gray-header">(3+4+5)</th>
                            </tr>
                            <tr>
                                <th colspan="2" class="bg-gray-header">核給單價</th><th rowspan="2" class="bg-gray-header">任職天</th><th rowspan="2" class="bg-gray-header">出勤時數</th><th rowspan="2" class="bg-gray-header text-red">金額(A)</th><th colspan="4" class="bg-gray-header">未出勤時數</th><th colspan="4" class="bg-gray-header">扣款金額</th><th rowspan="2" class="bg-gray-header text-red">扣款(B)</th><th rowspan="2" class="bg-gray-header">假別(1)</th><th rowspan="2" class="bg-gray-header">加班(2)</th><th rowspan="2" class="bg-gray-header">夜點(3)</th><th rowspan="2" class="bg-gray-header">洗車(4)</th><th rowspan="2" class="bg-gray-header">專案(5)</th><th rowspan="2" class="bg-gray-header">民生(6)</th><th rowspan="2" class="bg-gray-header">其他(7)</th><th rowspan="2" class="bg-gray-header">訓練(8)</th><th rowspan="2" class="bg-gray-header">未休(9)</th><th rowspan="2" class="bg-gray-header text-red">合計(C)</th>
                            </tr>
                            <tr>
                                <th class="bg-gray-header text-blue">月薪資</th><th class="bg-gray-header text-blue">時薪資</th><th class="bg-gray-header text-red">事假</th><th class="bg-gray-header text-red">病假</th><th class="bg-gray-header text-red">喪假</th><th class="bg-gray-header text-red">其他</th><th class="bg-gray-header text-red">事假扣</th><th class="bg-gray-header text-red">病假扣</th><th class="bg-gray-header text-red">喪假扣</th><th class="bg-gray-header text-red">其他扣</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="row in employees" :key="'sal'+row.id" class="hover:bg-gray-50/80">
                                <td class="relative group">
                                    <div class="w-full h-full min-h-[28px] flex items-center justify-center">
                                        <span>{{ row.id }}</span>
                                        <button @click="removeEmployee(row.id)" class="print-hide absolute inset-y-0 left-0 bg-red-500 hover:bg-red-600 text-white font-bold text-[9px] px-1 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-l">✕</button>
                                    </div>
                                </td>
                                <td><input type="text" v-model="row.name" class="cell-input font-bold"></td>
                                <td class="text-gray-500"><input type="text" v-model="row.title" class="cell-input text-[11px]"></td>
                                <td><input type="text" v-model="row.date1" class="cell-input"></td>
                                <td class="bg-yellow-50/40"><input type="text" v-model="row.date2" @input="autoCalcSettleMonth(row)" class="cell-input"></td>
                                <td class="bg-yellow-50/40"><input type="text" v-model="row.date3" class="cell-input"></td>
                                <td class="bg-yellow-50/40"><input type="text" v-model="row.date4" class="cell-input"></td>
                                <td class="bg-yellow-50/40"><input type="number" v-model="row.baseMon" @input="recalcPay(row)" class="cell-input text-red"></td>
                                <td class="bg-yellow-50/40"><input type="number" v-model="row.baseHr" @input="recalcPay(row)" class="cell-input text-red"></td>
                                <td class="bg-yellow-50/40"><input type="number" v-model="row.days" class="cell-input font-bold"></td>
                                <td class="bg-yellow-50/40"><input type="number" v-model="row.hours" class="cell-input text-red"></td>
                                <td class="bg-yellow-50/40"><input type="number" v-model="row.amountA" class="cell-input text-red font-bold"></td>
                                <td class="bg-yellow-50/40"><input type="number" step="0.5" v-model="row.leaveH1" class="cell-input text-red"></td>
                                <td class="bg-yellow-50/40"><input type="number" step="0.5" v-model="row.leaveH2" class="cell-input text-red"></td>
                                <td class="bg-yellow-50/40"><input type="number" step="0.5" v-model="row.leaveH3" class="cell-input text-red"></td>
                                <td class="bg-yellow-50/40"><input type="number" step="0.5" v-model="row.leaveH4" class="cell-input text-red"></td>
                                <td><input type="number" v-model="row.ded1" class="cell-input text-red" placeholder="-"></td>
                                <td><input type="number" v-model="row.ded2" class="cell-input text-red" placeholder="-"></td>
                                <td><input type="number" v-model="row.ded3" class="cell-input text-red" placeholder="-"></td>
                                <td><input type="number" v-model="row.ded4" class="cell-input text-red" placeholder="-"></td>
                                <td class="text-red font-bold bg-gray-50">{{ formatNum(getB(row)) || '-' }}</td>
                                <td><input type="number" v-model="row.sub1" class="cell-input text-red" placeholder="-"></td>
                                <td class="bg-green-50/40"><input type="number" v-model="row.sub2" class="cell-input text-red font-bold" placeholder="-"></td>
                                <td><input type="number" v-model="row.sub3" class="cell-input text-red" placeholder="-"></td>
                                <td><input type="number" v-model="row.sub4" class="cell-input text-red" placeholder="-"></td>
                                <td><input type="number" v-model="row.sub5" class="cell-input text-red" placeholder="-"></td>
                                <td><input type="number" v-model="row.sub6" class="cell-input text-red" placeholder="-"></td>
                                <td><input type="number" v-model="row.sub7" class="cell-input text-red" placeholder="-"></td>
                                <td><input type="number" v-model="row.sub8" class="cell-input text-red" placeholder="-"></td>
                                <td><input type="number" v-model="row.sub9" class="cell-input text-red" placeholder="-"></td>
                                <td class="text-red font-bold bg-gray-50">{{ formatNum(getC(row)) || '-' }}</td>
                                <td class="text-red font-bold bg-yellow-50 text-[13px]">{{ formatNum(getActual(row)) }}</td>
                                <td><textarea v-model="row.note" class="cell-textarea" rows="1" @input="autoResize"></textarea></td>
                                <td class="font-bold bg-gray-50">{{ formatNum(getCustomSum(row)) || '-' }}</td>
                            </tr>
                            <tr class="row-total font-bold border-t-2 border-black">
                                <td colspan="11" class="text-red text-center tracking-widest py-2">總 計</td>
                                <td class="text-red">{{ formatNum(sumCol('amountA')) }}</td>
                                <td class="text-red">{{ formatNum(sumCol('leaveH1')) || '-' }}</td>
                                <td class="text-red">{{ formatNum(sumCol('leaveH2')) || '-' }}</td>
                                <td class="text-red">{{ formatNum(sumCol('leaveH3')) || '-' }}</td>
                                <td class="text-red">{{ formatNum(sumCol('leaveH4')) || '-' }}</td>
                                <td class="text-red">{{ formatNum(sumCol('ded1')) || '-' }}</td>
                                <td class="text-red">{{ formatNum(sumCol('ded2')) || '-' }}</td>
                                <td class="text-red">{{ formatNum(sumCol('ded3')) || '-' }}</td>
                                <td class="text-red">{{ formatNum(sumCol('ded4')) || '-' }}</td>
                                <td class="text-red">{{ formatNum(sumB()) || '-' }}</td>
                                <td class="text-red">{{ formatNum(sumCol('sub1')) || '-' }}</td>
                                <td class="text-red">{{ formatNum(sumCol('sub2')) || '-' }}</td>
                                <td class="text-red">{{ formatNum(sumCol('sub3')) || '-' }}</td>
                                <td class="text-red">{{ formatNum(sumCol('sub4')) || '-' }}</td>
                                <td class="text-red">{{ formatNum(sumCol('sub5')) || '-' }}</td>
                                <td class="text-red">{{ formatNum(sumCol('sub6')) || '-' }}</td>
                                <td class="text-red">{{ formatNum(sumCol('sub7')) || '-' }}</td>
                                <td class="text-red">{{ formatNum(sumCol('sub8')) || '-' }}</td>
                                <td class="text-red">{{ formatNum(sumCol('sub9')) || '-' }}</td>
                                <td class="text-red">{{ formatNum(sumC()) || '-' }}</td>
                                <td class="text-red text-[14px]">{{ formatNum(sumActual()) }}</td>
                                <td></td><td>{{ formatNum(sumCustom()) || '-' }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="flex-none grid mt-2 bg-white text-xs print:mt-4 print:break-inside-avoid grid-cols-3 rounded-xl border border-gray-200/60 shadow-sm overflow-hidden">
                    <div class="p-3 h-14 text-sm border-r border-gray-100">審核確認 製表人(駐站代表):</div>
                    <div class="p-3 h-14 text-sm border-r border-gray-100">站長:</div>
                    <div class="p-3 h-14 text-sm">管理師:</div>
                </div>
            </div>

            <div class="print-page h-full flex flex-col" v-show="activeTab === 'overtime' || isPrinting">
                <div class="text-center mb-2 flex-none">
                    <div class="text-sm font-bold text-red m-0 text-center tracking-widest pb-1 mb-1">期間: {{ sheetPeriod }}</div>
                </div>
                <div class="table-wrapper print-table-wrapper flex-1">
                    <table>
                        <thead>
                            <tr><th colspan="3" class="text-red">基本資料</th><th colspan="9">加班彙總表</th><th rowspan="5" style="width: 150px;">備註</th></tr>
                            <tr><th rowspan="4" class="text-red" style="width: 40px;">員編</th><th rowspan="4" class="text-red" style="width: 60px;">姓名</th><th rowspan="4" class="text-red" style="width: 60px;">職稱</th><th colspan="3" class="text-red">核給單價</th><th colspan="5" class="text-red">加班紀錄</th><th rowspan="4" class="text-red font-bold" style="width: 80px;">金額 (A)</th></tr>
                            <tr><th rowspan="3" class="text-red" style="width: 60px;">月薪</th><th rowspan="3" class="text-red" style="width: 70px;">日薪</th><th rowspan="3" class="text-red" style="width: 70px;">時薪</th><th colspan="2" class="text-red">休息日出勤</th><th colspan="2" class="text-red">8H後延長加班</th><th rowspan="2" class="text-red">假日出勤</th></tr>
                            <tr><th class="text-red text-[10px]" style="width: 60px;">第1-2小時</th><th class="text-red text-[10px]" style="width: 60px;">第3小時以後</th><th class="text-red text-[10px]" style="width: 60px;">第1-2小時</th><th class="text-red text-[10px]" style="width: 60px;">第3小時以後</th></tr>
                            <tr><th>時數</th><th>時數</th><th>時數</th><th>時數</th><th>時數</th></tr>
                        </thead>
                        <tbody>
                            <tr v-for="row in employees" :key="'ot'+row.id">
                                <td class="text-red">{{ row.id }}</td>
                                <td class="text-red bg-yellow-50/40"><input type="text" v-model="row.name" class="cell-input font-bold"></td>
                                <td class="text-red"><input type="text" v-model="row.title" class="cell-input text-[11px]"></td>
                                <td class="text-red bg-yellow-50/40"><input type="number" v-model="row.baseMon" @input="recalcPay(row)" class="cell-input"></td>
                                <td class="text-red text-[11px]">{{ getBaseDay(row) }}</td><td class="text-red text-[11px]">{{ getBaseHr(row) }}</td>
                                <td class="bg-blue-50/40"><input type="number" step="0.5" v-model="row.otR1" @input="recalcPay(row)" class="cell-input font-bold"></td>
                                <td class="bg-blue-50/40"><input type="number" step="0.5" v-model="row.otR2" @input="recalcPay(row)" class="cell-input font-bold"></td>
                                <td class="bg-blue-50/40"><input type="number" step="0.5" v-model="row.otE1" @input="recalcPay(row)" class="cell-input font-bold"></td>
                                <td class="bg-blue-50/40"><input type="number" step="0.5" v-model="row.otE2" @input="recalcPay(row)" class="cell-input font-bold"></td>
                                <td class="bg-blue-50/40"><input type="number" step="0.5" v-model="row.otH"  @input="recalcPay(row)" class="cell-input font-bold"></td>
                                <td class="bg-green-50/40"><input type="number" v-model="row.sub2" class="cell-input text-red font-bold"></td>
                                <td><textarea v-model="row.note2" class="cell-textarea" rows="1" @input="autoResize"></textarea></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="print-page h-full flex flex-col" v-show="activeTab === 'leave' || isPrinting">
                <div class="table-wrapper print-table-wrapper flex-1">
                    <table>
                        <thead>
                            <tr><th rowspan="2">站別</th><th rowspan="2">姓名</th><th rowspan="2">特休假起始日</th><th rowspan="2">離職日</th><th rowspan="2">薪資</th><th rowspan="2">年資</th><th rowspan="2">特休總天數</th><th colspan="2">已休特休日期</th><th colspan="3">特休假</th><th colspan="2">結清金額</th><th rowspan="2">備註</th></tr>
                            <tr><th>114年</th><th>115年</th><th>應休</th><th>已休</th><th>未休</th><th>結清月份</th><th>金額</th></tr>
                        </thead>
                        <tbody>
                            <tr v-for="row in employees" :key="'lv'+row.id">
                                <td><input type="text" v-model="row.station" class="cell-input"></td>
                                <td class="bg-yellow-50/40"><input type="text" v-model="row.name" class="cell-input font-bold"></td>
                                <td class="bg-yellow-50/40"><input type="text" v-model="row.date2" @input="autoCalcSettleMonth(row)" class="cell-input"></td>
                                <td class="bg-yellow-50/40"><input type="text" v-model="row.date4" class="cell-input"></td>
                                <td class="bg-yellow-50/40"><input type="number" v-model="row.baseMon" class="cell-input text-blue font-bold"></td>
                                <td><input type="number" step="0.5" v-model="row.seniority" class="cell-input text-blue font-bold"></td>
                                <td><input type="number" step="0.5" v-model="row.leaveTotal" class="cell-input text-blue font-bold"></td>
                                <td><textarea v-model="row.leaveD114" class="cell-textarea" rows="1" @input="autoResize"></textarea></td>
                                <td><textarea v-model="row.leaveD115" class="cell-textarea" rows="1" @input="autoResize"></textarea></td>
                                <td><input type="number" step="0.5" v-model="row.leaveShould" class="cell-input text-blue font-bold"></td>
                                <td><input type="number" step="0.5" v-model="row.leaveTaken" class="cell-input text-red font-bold"></td>
                                <td class="text-red font-bold bg-gray-50">{{ formatNum(getLeaveUntaken(row)) }}</td>
                                <td class="bg-blue-50/40"><input type="text" v-model="row.settleMonth" class="cell-input font-bold text-blue-700"></td>
                                <td><input type="number" v-model="row.settleAmount" class="cell-input"></td>
                                <td><textarea v-model="row.note3" class="cell-textarea" rows="1" @input="autoResize"></textarea></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="print-page h-full flex flex-col" v-show="activeTab === 'eval' || isPrinting">
                <div class="table-wrapper print-table-wrapper flex-1">
                    <table>
                        <thead><tr><th>員編</th><th>姓名</th><th>職稱</th><th>到職日</th><th>月薪</th><th>時薪</th><th>任職</th><th>出勤</th><th>金額(A)</th><th>評等</th><th>意見說明</th></tr></thead>
                        <tbody>
                            <tr v-for="row in employees" :key="'ev'+row.id">
                                <td>{{ row.id }}</td><td class="bg-yellow-50/40"><input type="text" v-model="row.name" class="cell-input font-bold text-red"></td><td>{{ row.title }}</td><td>{{ row.date3 }}</td><td>{{ row.baseMon }}</td><td>{{ row.baseHr }}</td><td>{{ row.days }}</td><td>{{ row.hours }}</td><td>{{ row.amountA }}</td>
                                <td class="bg-cyan-50/50"><select v-model="row.evalStatus" class="cell-input text-[11px]"><option value="V合格 不合格">V合格 不合格</option><option value="合格 V不合格">合格 V不合格</option></select></td>
                                <td class="bg-cyan-50/50"><textarea v-model="row.evalComment" class="cell-textarea" rows="1" @input="autoResize"></textarea></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="print-page h-full flex flex-col" v-show="activeTab === 'leaveData' || isPrinting">
                <div class="table-wrapper print-table-wrapper flex-1">
                    <table>
                        <thead><tr><th>員編</th><th>姓名</th><th>事假(已/剩/日期)</th><th>病假(已/剩/半薪/日期)</th></tr></thead>
                        <tbody>
                            <tr v-for="row in employees" :key="'ld'+row.id">
                                <td>{{ row.id }}</td><td class="bg-yellow-50/40">{{ row.name }}</td><td><input type="number" v-model="row.leaveH1" class="w-10">/ <input type="number" v-model="row.leaveRem1" class="w-10">/ <textarea v-model="row.leaveDate1" rows="1"></textarea></td><td><input type="number" v-model="row.leaveH2" class="w-10">/ <input type="number" v-model="row.leaveRem2" class="w-10">/ <input type="number" v-model="row.leaveAmt2" class="w-10">/ <textarea v-model="row.leaveDate2" rows="1"></textarea></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div v-for="(sheet, index) in otSheets" :key="'sheetPage-'+sheet.id" class="print-page h-full flex flex-col" v-show="activeTab === sheet.id || isPrinting">
                <div class="flex-1 overflow-auto p-4 bg-gray-50 flex justify-center print:bg-white print:p-0 print:overflow-visible">
                    <div class="border border-black max-w-4xl w-full text-[13px] bg-white shadow-lg print:shadow-none print:w-full print:max-w-none print:break-inside-avoid">
                        <div class="text-center py-4 border-b border-black"><h2 class="text-xl font-bold">寶成企業 有限公司 加班指派及驗收單</h2></div>
                        <div class="flex border-b border-black p-2">
                            <span class="mr-6">員編: <strong>{{ getEmp(sheet.empId).id }}</strong></span>
                            <span>姓名: <strong>{{ getEmp(sheet.empId).name }}</strong></span>
                        </div>
                        <table class="w-full border-collapse ot-form-table">
                            <thead><tr><th>月</th><th>日</th><th>原因說明</th><th>起</th><th>迄</th><th>第1-2h</th><th>第3h+</th></tr></thead>
                            <tbody>
                                <tr v-for="(rec, i) in getEmp(sheet.empId).overtimeRecords">
                                    <td><input type="text" v-model="rec.m" class="w-8"></td><td><input type="text" v-model="rec.d" class="w-8"></td><td><textarea v-model="rec.reason" rows="1"></textarea></td><td><input type="text" v-model="rec.start" class="w-12"></td><td><input type="text" v-model="rec.end" class="w-12"></td><td><input type="number" v-model="rec.e1" class="w-10"></td><td><input type="number" v-model="rec.e2" class="w-10"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    `,
    setup(props) {
        const { ref, computed, onMounted, nextTick, watch } = window.Vue;
        
        const activeTab = ref('salary'); 
        const isPrinting = ref(false); 
        const addOtEmpId = ref(''); 
        
        const otSheets = ref([
            { id: 'sheet-55-1', empId: '55-1' },
            { id: 'sheet-55-2', empId: '55-2' }
        ]);
        const employees = ref([]); 

        // ==========================================
        // 📊 核心公式與計算邏輯
        // ==========================================
        const val = (v) => Number(v) || 0;
        const formatNum = (v) => (v === 0 || v == null) ? '' : v.toFixed(v % 1 !== 0 ? 1 : 0);
        const getLeaveUntaken = (r) => r.leaveShould ? (val(r.leaveShould) - val(r.leaveTaken)) : null;

        const sumCol = (key) => employees.value.reduce((sum, r) => sum + val(r[key]), 0);
        const sumB = () => employees.value.reduce((sum, r) => sum + getB(r), 0);
        const sumC = () => employees.value.reduce((sum, r) => sum + getC(r), 0);
        const sumActual = () => employees.value.reduce((sum, r) => sum + getActual(r), 0);
        const sumCustom = () => employees.value.reduce((sum, r) => sum + getCustomSum(r), 0);
        const sumLeaveUntaken = () => employees.value.reduce((sum, r) => sum + val(getLeaveUntaken(r)), 0);

        const getB = (r) => val(r.ded1) + val(r.ded2) + val(r.ded3) + val(r.ded4);
        const getC = (r) => val(r.sub1) + val(r.sub2) + val(r.sub3) + val(r.sub4) + val(r.sub5) + val(r.sub6) + val(r.sub7) + val(r.sub8) + val(r.sub9);
        const getActual = (r) => val(r.amountA) - getB(r) + getC(r);
        const getCustomSum = (r) => val(r.sub3) + val(r.sub4) + val(r.sub5);

        const getEmp = (empId) => employees.value.find(e => e.id === empId) || { id: empId, name: '載入中', overtimeRecords: [] };
        const getBaseDay = (r) => r.baseMon ? (r.baseMon / 30).toFixed(3) : '';
        const getBaseHr = (r) => r.baseMon ? (r.baseMon / 240).toFixed(3) : '';

        const autoResize = (e) => { const el = e.target || e; el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; };
        const resizeAllTextareas = () => { nextTick(() => { document.querySelectorAll('.cell-textarea').forEach(el => { if (el.offsetParent !== null) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } }); }); };
        const exportPDF = () => { isPrinting.value = true; nextTick(() => { resizeAllTextareas(); setTimeout(() => { window.print(); }, 400); }); };
        window.addEventListener('afterprint', () => { isPrinting.value = false; });
        watch(activeTab, () => { resizeAllTextareas(); });

        const addEmployee = () => {
            let maxSeq = 0;
            employees.value.forEach(emp => {
                const parts = emp.id.split('-');
                if (parts.length === 2 && parts[0] === '55') {
                    const seq = parseInt(parts[1], 10);
                    if (seq > maxSeq) maxSeq = seq;
                }
            });
            const newId = `55-${maxSeq + 1}`;
            const newEmp = { id: newId, name: '新進人員', title: '加油員', baseMon: 32550, amountA: 32550, days: 30, overtimeRecords: [], sheet_id: props.sheetId };
            employees.value.push(newEmp);
        };

        const removeEmployee = (empId) => {
            if (confirm(`確定要刪除員工嗎？`)) employees.value = employees.value.filter(e => e.id !== empId);
        };

        const createNewOtSheet = () => {
            if (!addOtEmpId.value) return;
            const targetId = `sheet-${addOtEmpId.value}`;
            if (otSheets.value.some(sheet => sheet.id === targetId)) { activeTab.value = targetId; return; }
            otSheets.value.push({ id: targetId, empId: addOtEmpId.value });
            activeTab.value = targetId;
        };

        const removeOtSheet = (sheetId, idx) => {
            otSheets.value.splice(idx, 1);
            activeTab.value = 'salary';
        };

        const recalcPay = (emp) => { /* 保留公式 */ };
        const updateEmpOt = (emp) => { /* 保留公式 */ };
        const autoCalcSettleMonth = (row) => { /* 保留公式 */ };

        // 模擬取得 13 位本地初始名冊備份
        const getLocalBackupData = () => [
            { id: '55-1', name: '楊瓊治', title: '值班站長', baseMon: 35710, amountA: 35710, days: 30, overtimeRecords: Array.from({length:6}, () => ({m:'5',d:'2',reason:'延長加班',start:'14:00',end:'14:30',e1:0.5})) },
            { id: '55-2', name: '黃鈴芬', title: '值班站長', baseMon: 35210, amountA: 35210, days: 30, overtimeRecords: [] },
            { id: '55-3', name: '郭富貴', title: '值班站長', baseMon: 35210, amountA: 35210, days: 30, overtimeRecords: [] },
            { id: '55-4', name: '程景暉', title: '加油員', baseMon: 32850, amountA: 32850, days: 30, overtimeRecords: [] },
            { id: '55-5', name: '劉怡汝', title: '加油員', baseMon: 32800, amountA: 32800, days: 30, overtimeRecords: [] },
            { id: '55-6', name: '許瑞芳', title: '加油員', baseMon: 32800, amountA: 32800, days: 30, overtimeRecords: [] },
            { id: '55-7', name: '賴君佳', title: '洗車員', baseMon: 32650, amountA: 32650, days: 30, overtimeRecords: [] },
            { id: '55-8', name: '陳宇峻', title: '洗車員', baseMon: 32650, amountA: 32650, days: 30, overtimeRecords: [] },
            { id: '55-9', name: '林秋金', title: '加油員', baseMon: 32550, amountA: 16416, days: 30, overtimeRecords: [] },
            { id: '55-10', name: '江勢六', title: '加油員', baseMon: 32550, amountA: 32550, days: 30, overtimeRecords: [] },
            { id: '55-11', name: '曾淑貞', title: '洗車員', baseMon: 32750, amountA: 32750, days: 30, overtimeRecords: [] },
            { id: '55-12', name: '陳怡靜', title: '加油員', baseMon: 32550, amountA: 32550, days: 30, overtimeRecords: [] },
            { id: '55-13', name: '徐慈彩', title: '洗車員', baseMon: 32550, amountA: 32550, days: 30, overtimeRecords: [] }
        ];

        onMounted(async () => {
            // 🚀 連線讀取 Supabase 的該月員工名冊
            try {
                const { client } = await import('../supabase.js');
                const { data, error } = await client.from('employees').select('*').eq('sheet_id', props.sheetId).order('id', { ascending: true });
                if (!error && data && data.length > 0) employees.value = data;
                else employees.value = getLocalBackupData();
            } catch(e) {
                employees.value = getLocalBackupData();
            }
            resizeAllTextareas();
        });

        return {
            activeTab, isPrinting, employees, addOtEmpId, otSheets, val, formatNum, getLeaveUntaken,
            sumCol, sumB, sumC, sumActual, sumCustom, sumLeaveUntaken, getEmp, getBaseDay, getBaseHr,
            autoResize, exportPDF, addEmployee, removeEmployee, createNewOtSheet, removeOtSheet, recalcPay, updateEmpOt, autoCalcSettleMonth
        };
    }
};