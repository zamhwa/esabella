import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Check, Clock, MapPin, User, Phone, CalendarDays } from 'lucide-react';

const TIME_SLOTS = [
  '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00',
];

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function BookingCalendar() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState<'date' | 'form' | 'done'>('date');
  const [form, setForm] = useState({ name: '', phone: '', address: '', note: '' });

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(viewYear - 1); setViewMonth(11); }
    else setViewMonth(viewMonth - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(viewYear + 1); setViewMonth(0); }
    else setViewMonth(viewMonth + 1);
  };

  const isDisabled = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    const dow = d.getDay();
    if (dow === 0) return true; // 일요일 휴무
    if (d < new Date(today.getFullYear(), today.getMonth(), today.getDate())) return true;
    return false;
  };

  const isSaturday = (day: number) => new Date(viewYear, viewMonth, day).getDay() === 6;

  const dateKey = (day: number) => `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const handleSubmit = () => {
    setStep('done');
  };

  const reset = () => {
    setSelectedDate(null);
    setSelectedTime(null);
    setForm({ name: '', phone: '', address: '', note: '' });
    setStep('date');
  };

  const formatSelectedDate = () => {
    if (!selectedDate) return '';
    const [y, m, d] = selectedDate.split('-').map(Number);
    const dow = DAYS[new Date(y, m - 1, d).getDay()];
    return `${y}년 ${m}월 ${d}일 (${dow})`;
  };

  return (
    <section id="booking" className="bg-white py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold tracking-[0.3em] text-amber-800 uppercase">Reservation</span>
          <h2 className="text-3xl md:text-5xl font-serif mt-4 mb-4 text-stone-900">무료 방문 상담 예약</h2>
          <p className="text-stone-500 text-base max-w-lg mx-auto">
            원하시는 날짜와 시간을 선택하면 전문 컨설턴트가 방문합니다.
          </p>
        </div>

        <div className="bg-stone-50 rounded-3xl border border-stone-100 overflow-hidden shadow-sm">
          {/* Steps indicator */}
          <div className="flex border-b border-stone-100">
            {[
              { key: 'date', label: '날짜 선택', num: 1 },
              { key: 'form', label: '정보 입력', num: 2 },
              { key: 'done', label: '예약 완료', num: 3 },
            ].map((s, i) => (
              <div
                key={s.key}
                className={`flex-1 py-4 text-center text-xs font-bold tracking-wide transition-colors ${
                  step === s.key
                    ? 'bg-stone-900 text-white'
                    : (step === 'done' || (step === 'form' && s.key === 'date'))
                      ? 'bg-amber-800/10 text-amber-800'
                      : 'text-stone-400'
                }`}
              >
                <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] mr-1.5 ${
                  step === s.key ? 'bg-white text-stone-900' :
                  (step === 'done' || (step === 'form' && s.key === 'date')) ? 'bg-amber-800 text-white' :
                  'bg-stone-200 text-stone-500'
                }`}>
                  {(step === 'done' || (step === 'form' && s.key === 'date')) ? <Check className="h-3 w-3" /> : s.num}
                </span>
                {s.label}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 'date' && (
              <motion.div
                key="date"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-6 md:p-10"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Calendar */}
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <button onClick={prevMonth} className="p-2 rounded-full hover:bg-stone-200 transition-colors">
                        <ChevronLeft className="h-4 w-4 text-stone-600" />
                      </button>
                      <h3 className="text-base font-bold text-stone-900">
                        {viewYear}년 {viewMonth + 1}월
                      </h3>
                      <button onClick={nextMonth} className="p-2 rounded-full hover:bg-stone-200 transition-colors">
                        <ChevronRight className="h-4 w-4 text-stone-600" />
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {DAYS.map((d, i) => (
                        <div key={d} className={`text-center text-[11px] font-bold py-1.5 ${
                          i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-stone-400'
                        }`}>
                          {d}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: firstDay }).map((_, i) => (
                        <div key={`e-${i}`} />
                      ))}
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dk = dateKey(day);
                        const disabled = isDisabled(day);
                        const selected = selectedDate === dk;
                        const isToday = viewYear === today.getFullYear() && viewMonth === today.getMonth() && day === today.getDate();
                        const sat = isSaturday(day);
                        const sun = new Date(viewYear, viewMonth, day).getDay() === 0;

                        return (
                          <button
                            key={day}
                            disabled={disabled}
                            onClick={() => setSelectedDate(dk)}
                            className={`aspect-square rounded-xl text-sm font-medium transition-all relative ${
                              selected
                                ? 'bg-stone-900 text-white shadow-lg'
                                : disabled
                                  ? 'text-stone-300 cursor-not-allowed'
                                  : 'hover:bg-stone-200 text-stone-700'
                            } ${sun && !selected ? '!text-red-300' : ''} ${sat && !selected && !disabled ? '!text-blue-500' : ''}`}
                          >
                            {day}
                            {isToday && !selected && (
                              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-800" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-4 flex items-center gap-4 text-[10px] text-stone-400">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-300" /> 일요일 휴무</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400" /> 토요일 (10~15시)</span>
                    </div>
                  </div>

                  {/* Time slots */}
                  <div>
                    <h4 className="text-sm font-bold text-stone-700 mb-4 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {selectedDate ? `${formatSelectedDate()}` : '날짜를 먼저 선택하세요'}
                    </h4>

                    {selectedDate ? (
                      <>
                        <div className="grid grid-cols-2 gap-2">
                          {TIME_SLOTS.map((time) => {
                            const isSat = (() => {
                              const [y, m, d] = selectedDate.split('-').map(Number);
                              return new Date(y, m - 1, d).getDay() === 6;
                            })();
                            const hour = parseInt(time);
                            const disabled = isSat && (hour < 10 || hour >= 15);

                            return (
                              <button
                                key={time}
                                disabled={disabled}
                                onClick={() => setSelectedTime(time)}
                                className={`py-3.5 rounded-xl text-sm font-medium transition-all ${
                                  selectedTime === time
                                    ? 'bg-stone-900 text-white shadow-lg'
                                    : disabled
                                      ? 'bg-stone-100 text-stone-300 cursor-not-allowed'
                                      : 'bg-white border border-stone-200 text-stone-700 hover:border-stone-400'
                                }`}
                              >
                                {time}
                              </button>
                            );
                          })}
                        </div>

                        <button
                          disabled={!selectedTime}
                          onClick={() => setStep('form')}
                          className="w-full mt-6 py-4 bg-stone-900 text-white rounded-xl font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-800 transition-colors"
                        >
                          다음 단계
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-48 text-stone-300">
                        <div className="text-center">
                          <CalendarDays className="h-10 w-10 mx-auto mb-3 opacity-40" />
                          <p className="text-sm">날짜를 선택해주세요</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'form' && (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-6 md:p-10"
              >
                <div className="max-w-md mx-auto">
                  <div className="bg-white rounded-xl border border-stone-100 p-4 mb-8 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-stone-900 flex items-center justify-center shrink-0">
                      <CalendarDays className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-stone-900">{formatSelectedDate()}</p>
                      <p className="text-xs text-amber-800 font-medium">{selectedTime} 방문 예정</p>
                    </div>
                    <button onClick={() => setStep('date')} className="ml-auto text-xs text-stone-400 hover:text-stone-700 underline">
                      변경
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                        <User className="h-3.5 w-3.5 inline mr-1" /> 이름 *
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="홍길동"
                        className="w-full px-4 py-3.5 rounded-xl border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none text-sm transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                        <Phone className="h-3.5 w-3.5 inline mr-1" /> 연락처 *
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="010-1234-5678"
                        className="w-full px-4 py-3.5 rounded-xl border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none text-sm transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                        <MapPin className="h-3.5 w-3.5 inline mr-1" /> 방문 주소 *
                      </label>
                      <input
                        type="text"
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        placeholder="서울시 강남구 역삼동 123-45"
                        className="w-full px-4 py-3.5 rounded-xl border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none text-sm transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                        요청 사항
                      </label>
                      <textarea
                        value={form.note}
                        onChange={(e) => setForm({ ...form, note: e.target.value })}
                        placeholder="관심 있는 블라인드 종류, 창 개수 등 자유롭게 적어주세요"
                        rows={3}
                        className="w-full px-4 py-3.5 rounded-xl border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none text-sm resize-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-8">
                    <button
                      onClick={() => setStep('date')}
                      className="px-6 py-4 rounded-xl border border-stone-200 text-stone-600 font-bold text-sm hover:bg-stone-100 transition-colors"
                    >
                      이전
                    </button>
                    <button
                      disabled={!form.name || !form.phone || !form.address}
                      onClick={handleSubmit}
                      className="flex-1 py-4 bg-stone-900 text-white rounded-xl font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-800 transition-colors"
                    >
                      예약 신청하기
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'done' && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-10 md:p-16 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                  className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
                >
                  <Check className="h-10 w-10 text-green-600" />
                </motion.div>
                <h3 className="text-2xl font-serif font-bold text-stone-900 mb-3">예약이 완료되었습니다</h3>
                <p className="text-stone-500 text-sm mb-2">
                  <span className="font-bold text-stone-700">{formatSelectedDate()} {selectedTime}</span>에 방문 예정입니다.
                </p>
                <p className="text-stone-400 text-sm mb-8">
                  확인 문자가 {form.phone}으로 발송됩니다.
                </p>

                <div className="bg-stone-50 rounded-xl p-5 max-w-sm mx-auto text-left space-y-2 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-400">이름</span>
                    <span className="font-medium text-stone-700">{form.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-400">연락처</span>
                    <span className="font-medium text-stone-700">{form.phone}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-400">주소</span>
                    <span className="font-medium text-stone-700 text-right max-w-[200px]">{form.address}</span>
                  </div>
                  {form.note && (
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-400">요청</span>
                      <span className="font-medium text-stone-700 text-right max-w-[200px]">{form.note}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={reset}
                  className="px-8 py-3.5 bg-stone-900 text-white rounded-xl font-bold text-sm hover:bg-stone-800 transition-colors"
                >
                  확인
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
