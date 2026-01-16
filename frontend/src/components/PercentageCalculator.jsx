import React, { useState, useEffect } from 'react';
import { ArrowLeft, Delete, ChevronLeft, ChevronRight, Menu } from 'lucide-react';

const PercentageCalculator = ({ onBack, theme }) => {
    const [mode, setMode] = useState('Aumento');
    const [val1, setVal1] = useState(''); // Initial
    const [val2, setVal2] = useState(''); // Percentage
    const [valDelta, setValDelta] = useState(''); // Change
    const [valFinal, setValFinal] = useState(''); // Final
    const [activeField, setActiveField] = useState('val1');

    const isDark = theme === 'dark';

    const parse = (v) => parseFloat(v.toString().replace(',', '.')) || 0;
    const format = (v) => {
        if (isNaN(v) || !isFinite(v)) return '';
        return Number(v.toFixed(2)).toString().replace('.', ',');
    };

    const runSync = (fieldName, newValue) => {
        const v = parse(newValue);
        const v1 = fieldName === 'val1' ? v : parse(val1);
        const v2 = fieldName === 'val2' ? v : parse(val2);
        const vd = fieldName === 'valDelta' ? v : parse(valDelta);
        const vf = fieldName === 'valFinal' ? v : parse(valFinal);

        if (fieldName === 'val1' || fieldName === 'val2') {
            const currentV1 = fieldName === 'val1' ? v : parse(val1);
            const currentV2 = fieldName === 'val2' ? v : parse(val2);
            const delta = currentV1 * (currentV2 / 100);
            setValDelta(format(delta));
            if (mode === 'Aumento') setValFinal(format(currentV1 + delta));
            else if (mode === 'Descuento') setValFinal(format(currentV1 - delta));
            else setValFinal(format(delta));
        }
        else if (fieldName === 'valDelta') {
            const currentV1 = parse(val1);
            const percent = currentV1 !== 0 ? (v / currentV1) * 100 : 0;
            setVal2(format(percent));
            if (mode === 'Aumento') setValFinal(format(currentV1 + v));
            else if (mode === 'Descuento') setValFinal(format(currentV1 - v));
            else setValFinal(format(v));
        }
        else if (fieldName === 'valFinal') {
            const currentV1 = parse(val1);
            let delta = 0;
            if (mode === 'Aumento') delta = v - currentV1;
            else if (mode === 'Descuento') delta = currentV1 - v;
            else delta = v;

            setValDelta(format(delta));
            const percent = currentV1 !== 0 ? (delta / currentV1) * 100 : 0;
            setVal2(format(percent));
        }
    };

    const handleKeypad = (key) => {
        let current = '';
        let setter = null;

        if (activeField === 'val1') { current = val1; setter = setVal1; }
        else if (activeField === 'val2') { current = val2; setter = setVal2; }
        else if (activeField === 'valDelta') { current = valDelta; setter = setValDelta; }
        else { current = valFinal; setter = setValFinal; }

        if (key === 'AC') {
            setVal1(''); setVal2(''); setValDelta(''); setValFinal('');
            return;
        }

        let newVal = current.toString();
        if (key === 'BACK') {
            newVal = newVal.slice(0, -1);
        } else if (key === ',') {
            if (!newVal.includes(',')) newVal = newVal + ',';
        } else if (/^\d$/.test(key)) {
            newVal = (newVal === '0' ? '' : newVal) + key;
        }

        setter(newVal);
        runSync(activeField, newVal);
    };

    return (
        <div className={`flex flex-col mx-auto max-w-md w-full shadow-2xl overflow-hidden font-sans border border-gray-300 ${isDark ? 'bg-zinc-950' : 'bg-[#f5f5f5]'}`}>

            {/* Header (Matching image) */}
            <div className="bg-[#b71c1c] text-white p-3 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-1">
                        <Menu size={24} />
                    </button>
                </div>
                <div className="flex items-center gap-1 cursor-pointer">
                    <span className="text-xl font-medium tracking-tight">
                        {mode}
                    </span>
                    <select
                        value={mode}
                        onChange={(e) => setMode(e.target.value)}
                        className="absolute opacity-0 w-24 cursor-pointer"
                    >
                        <option value="Aumento">Aumento</option>
                        <option value="Descuento">Descuento</option>
                        <option value="Porcentaje de">Porcentaje de</option>
                    </select>
                    <span className="text-xs pt-1">▼</span>
                </div>
            </div>

            {/* Display Sections (Exactly like image) */}
            <div className="flex flex-col">

                {/* Valor Inicial */}
                <div
                    onClick={() => setActiveField('val1')}
                    className={`h-28 flex flex-col items-center justify-center border-b border-gray-300 relative cursor-pointer transition-all ${activeField === 'val1' ? (isDark ? 'bg-white/5' : 'bg-white') : ''}`}
                >
                    <span className="text-gray-400 text-sm mb-1 lowercase">valor inicial</span>
                    <span className={`text-4xl font-light ${!val1 ? 'text-gray-300' : (isDark ? 'text-white' : 'text-gray-800')}`}>
                        {val1 || '0'}
                    </span>
                    {activeField === 'val1' && <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#00ff44]"></div>}
                </div>

                {/* Porcentaje & Cambio Row */}
                <div className="flex border-b border-gray-300 h-28">
                    <div
                        onClick={() => setActiveField('val2')}
                        className={`flex-1 flex flex-col items-center justify-center border-r border-red-600 relative cursor-pointer ${activeField === 'val2' ? (isDark ? 'bg-white/5' : 'bg-white') : ''}`}
                    >
                        <span className="text-gray-400 text-sm mb-1 lowercase">porcentaje</span>
                        <span className={`text-3xl font-light ${!val2 ? 'text-gray-300' : (isDark ? 'text-white' : 'text-gray-800')}`}>
                            {val2 || '0'}
                        </span>
                        {activeField === 'val2' && <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#ff0000]"></div>}
                    </div>
                    <div
                        onClick={() => setActiveField('valDelta')}
                        className={`flex-1 flex flex-col items-center justify-center relative cursor-pointer ${activeField === 'valDelta' ? (isDark ? 'bg-white/5' : 'bg-white') : ''}`}
                    >
                        <span className="text-gray-400 text-sm mb-1 lowercase">cambio</span>
                        <span className={`text-3xl font-light ${!valDelta ? 'text-gray-300' : (isDark ? 'text-white' : 'text-gray-800')}`}>
                            {valDelta || '0'}
                        </span>
                        {activeField === 'valDelta' && <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#ff0000]"></div>}
                    </div>
                </div>

                {/* Valor Final */}
                <div
                    onClick={() => setActiveField('valFinal')}
                    className={`h-28 flex flex-col items-center justify-center relative cursor-pointer ${activeField === 'valFinal' ? (isDark ? 'bg-white/5' : 'bg-white') : ''}`}
                >
                    <span className="text-gray-400 text-sm mb-1 lowercase">valor final</span>
                    <span className={`text-4xl font-light ${!valFinal ? 'text-gray-300' : (isDark ? 'text-white' : 'text-gray-800')}`}>
                        {valFinal || '0'}
                    </span>
                    <div className="absolute left-0 top-4 bottom-4 w-1 bg-[#b71c1c]"></div>
                    {activeField === 'valFinal' && <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#00ff44]"></div>}
                </div>
            </div>

            {/* Keypad (4x4 Grid - Matching image) */}
            <div className={`grid grid-cols-4 bg-gray-200 gap-[1px]`}>
                {[
                    '7', '8', '9', 'BACK',
                    '4', '5', '6', 'AC',
                    '1', '2', '3', 'ENTER',
                    '0', ',', 'PREV', 'NEXT'
                ].map((k) => (
                    <button
                        key={k}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                            if (k === 'ENTER' || k === 'NEXT') {
                                const order = ['val1', 'val2', 'valDelta', 'valFinal'];
                                const nextIdx = (order.indexOf(activeField) + 1) % 4;
                                setActiveField(order[nextIdx]);
                            }
                            else if (k === 'PREV') {
                                const order = ['val1', 'val2', 'valDelta', 'valFinal'];
                                const nextIdx = (order.indexOf(activeField) - 1 + 4) % 4;
                                setActiveField(order[nextIdx]);
                            }
                            else handleKeypad(k);
                        }}
                        className={`h-16 text-2xl flex items-center justify-center transition-colors ${isDark ? 'bg-zinc-900 text-white active:bg-zinc-700' : 'bg-white text-gray-700 active:bg-gray-100'}`}
                    >
                        {k === 'BACK' && <Delete size={26} strokeWidth={1.5} className="opacity-70" />}
                        {k === 'AC' && <span className="text-gray-400 text-xl">AC</span>}
                        {k === 'ENTER' && <span className="text-2xl transform rotate-90">⏎</span>}
                        {k === 'PREV' && <ChevronLeft size={28} className="opacity-50" />}
                        {k === 'NEXT' && <ChevronRight size={28} className="opacity-50" />}
                        {!['BACK', 'AC', 'ENTER', 'PREV', 'NEXT'].includes(k) && k}
                    </button>
                ))}
            </div>

            {/* Bottom Nav Bar Placeholder (Matching image) */}
            <div className="bg-[#b71c1c] h-12 flex items-center justify-around px-12">
                <div className="w-1 h-3 border-l-2 border-r-2 border-white/40"></div>
                <div className="w-4 h-4 border-2 border-white/40 rounded-sm"></div>
                <div className="text-white/40 text-xl font-bold">〈</div>
            </div>
        </div>
    );
};

export default PercentageCalculator;
