import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Phone, MessageCircle } from 'lucide-react';

export default function KakaoFloat() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl border border-stone-100 w-72 overflow-hidden mb-2"
          >
            <div className="bg-[#FEE500] px-5 py-4">
              <p className="font-bold text-stone-900 text-sm">이사벨라 블라인드</p>
              <p className="text-[11px] text-stone-600 mt-0.5">무료 상담 & 방문 예약</p>
            </div>
            <div className="p-4 space-y-2.5">
              <a
                href="https://pf.kakao.com/_xexample/chat"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3.5 rounded-xl bg-[#FEE500] hover:bg-[#F5DC00] transition-colors group"
              >
                <div className="w-9 h-9 rounded-full bg-[#3C1E1E] flex items-center justify-center shrink-0">
                  <MessageCircle className="h-4.5 w-4.5 text-[#FEE500]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-stone-900">카카오톡 상담</p>
                  <p className="text-[10px] text-stone-600">실시간 1:1 채팅 상담</p>
                </div>
              </a>
              <a
                href="tel:010-0000-0000"
                className="flex items-center gap-3 p-3.5 rounded-xl bg-stone-50 hover:bg-stone-100 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-stone-900 flex items-center justify-center shrink-0">
                  <Phone className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-stone-900">전화 상담</p>
                  <p className="text-[10px] text-stone-500">010-0000-0000</p>
                </div>
              </a>
            </div>
            <div className="px-4 pb-4">
              <p className="text-[10px] text-stone-400 text-center">평일 09:00 ~ 18:00 · 토요일 10:00 ~ 15:00</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-colors"
        style={{ backgroundColor: open ? '#1C1917' : '#FEE500' }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        {open ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <MessageCircle className="h-6 w-6 text-[#3C1E1E]" />
        )}
      </motion.button>
    </div>
  );
}
