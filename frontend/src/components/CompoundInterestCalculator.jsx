import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, PieChart, Calendar, DollarSign, ArrowLeft } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const CompoundInterestCalculator = ({ onBack, theme }) => {
    const [initialAmount, setInitialAmount] = useState(10000);
    const [monthlyContribution, setMonthlyContribution] = useState(500);
    const [years, setYears] = useState(20);
    const [interestRate, setInterestRate] = useState(7);
    const [compoundingFrequency, setCompoundingFrequency] = useState(12); // Monthly default
    const [results, setResults] = useState([]);
    const [totals, setTotals] = useState({ totalValue: 0, totalContributions: 0, totalInterest: 0 });

    useEffect(() => {
        calculate();
    }, [initialAmount, monthlyContribution, years, interestRate, compoundingFrequency]);

    const calculate = () => {
        let currentBalance = parseFloat(initialAmount);
        let totalInvested = parseFloat(initialAmount);
        const rate = parseFloat(interestRate) / 100;
        const months = parseInt(years) * 12;
        const data = [];

        for (let i = 0; i <= months; i++) {
            if (i > 0) {
                // Add monthly contribution
                currentBalance += parseFloat(monthlyContribution);
                totalInvested += parseFloat(monthlyContribution);

                // Apply compounding interest (monthly simplified)
                // If frequency is monthly, we apply it every month. 
                // If annually, we'd only apply it every 12 months.
                const monthlyRate = rate / compoundingFrequency;
                // This is a simplification. Usually compounding is calculated as (1 + r/n)^(n*t)
                // For a granular month-by-month view:
                if (compoundingFrequency === 12) {
                    currentBalance *= (1 + monthlyRate);
                } else if (compoundingFrequency === 1 && i % 12 === 0) {
                    currentBalance *= (1 + rate);
                }
            }

            if (i % 12 === 0 || i === months) {
                data.push({
                    year: i / 12,
                    balance: Math.round(currentBalance),
                    invested: Math.round(totalInvested),
                    interest: Math.round(currentBalance - totalInvested)
                });
            }
        }

        setResults(data);
        setTotals({
            totalValue: currentBalance,
            totalContributions: totalInvested,
            totalInterest: currentBalance - totalInvested
        });
    };

    const isDark = theme === 'dark';

    return (
        <div className={`p-4 sm:p-8 max-w-4xl mx-auto ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={onBack}
                    className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent">
                    Calculadora de Interés Compuesto
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* INPUTS SECTION */}
                <div className={`lg:col-span-1 p-6 rounded-2xl border ${isDark ? 'bg-gray-900/50 border-white/10' : 'bg-white border-gray-200 shadow-xl'} flex flex-col gap-6`}>
                    <div>
                        <label className="block text-sm font-medium mb-2 opacity-70">Inversión Inicial (€)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" size={18} />
                            <input
                                type="number"
                                value={initialAmount}
                                onChange={(e) => setInitialAmount(e.target.value)}
                                className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all ${isDark ? 'bg-black/30 border-white/10 focus:border-yellow-500' : 'bg-gray-50 border-gray-200 focus:border-yellow-600'}`}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 opacity-70">Aportación Mensual (€)</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" size={18} />
                            <input
                                type="number"
                                value={monthlyContribution}
                                onChange={(e) => setMonthlyContribution(e.target.value)}
                                className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all ${isDark ? 'bg-black/30 border-white/10 focus:border-yellow-500' : 'bg-gray-50 border-gray-200 focus:border-yellow-600'}`}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 opacity-70">Años de Inversión</label>
                        <input
                            type="range"
                            min="1" max="50"
                            value={years}
                            onChange={(e) => setYears(e.target.value)}
                            className="w-full accent-yellow-500 mb-2"
                        />
                        <div className="flex justify-between text-xs opacity-50">
                            <span>1 año</span>
                            <span className="font-bold text-yellow-500 text-lg">{years} años</span>
                            <span>50 años</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 opacity-70">Interés Anual (%)</label>
                        <div className="relative">
                            <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" size={18} />
                            <input
                                type="number"
                                step="0.1"
                                value={interestRate}
                                onChange={(e) => setInterestRate(e.target.value)}
                                className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all ${isDark ? 'bg-black/30 border-white/10 focus:border-yellow-500' : 'bg-gray-50 border-gray-200 focus:border-yellow-600'}`}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 opacity-70">Frecuencia de Capitalización</label>
                        <select
                            value={compoundingFrequency}
                            onChange={(e) => setCompoundingFrequency(parseInt(e.target.value))}
                            className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${isDark ? 'bg-black/30 border-white/10 focus:border-yellow-500' : 'bg-gray-50 border-gray-200 focus:border-yellow-600 font-medium'}`}
                        >
                            <option value={12}>Mensual</option>
                            <option value={4}>Trimestral</option>
                            <option value={1}>Anual</option>
                        </select>
                    </div>
                </div>

                {/* RESULTS SECTION */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className={`p-4 rounded-2xl border min-w-0 overflow-hidden ${isDark ? 'bg-black/40 border-white/10' : 'bg-white border-gray-200 shadow-md'}`}>
                            <p className="text-xs opacity-50 uppercase tracking-wider mb-1 truncate">Valor Final</p>
                            <p className="text-xl sm:text-2xl font-bold text-yellow-500 truncate">{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(totals.totalValue)}</p>
                        </div>
                        <div className={`p-4 rounded-2xl border min-w-0 overflow-hidden ${isDark ? 'bg-black/40 border-white/10' : 'bg-white border-gray-200 shadow-md'}`}>
                            <p className="text-xs opacity-50 uppercase tracking-wider mb-1 truncate">Total Invertido</p>
                            <p className="text-xl sm:text-2xl font-bold truncate">{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(totals.totalContributions)}</p>
                        </div>
                        <div className={`p-4 rounded-2xl border min-w-0 overflow-hidden ${isDark ? 'bg-black/40 border-white/10' : 'bg-white border-gray-200 shadow-md'}`}>
                            <p className="text-xs opacity-50 uppercase tracking-wider mb-1 truncate">Total Intereses</p>
                            <p className="text-xl sm:text-2xl font-bold text-green-500 truncate">+{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(totals.totalInterest)}</p>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className={`flex-1 p-6 rounded-2xl border ${isDark ? 'bg-black/40 border-white/10' : 'bg-white border-gray-200 shadow-xl'} min-h-[400px]`}>
                        <p className="text-lg font-bold mb-6 flex items-center gap-2">
                            <PieChart size={20} className="text-yellow-500" />
                            Crecimiento de la Inversión
                        </p>
                        <div className="w-full h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={results}>
                                    <defs>
                                        <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#eab308" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                                    <XAxis
                                        dataKey="year"
                                        label={{ value: 'Años', position: 'insideBottomRight', offset: -5 }}
                                        stroke={isDark ? '#555' : '#999'}
                                        fontSize={12}
                                    />
                                    <YAxis
                                        tickFormatter={(val) => `${val / 1000}k`}
                                        stroke={isDark ? '#555' : '#999'}
                                        fontSize={12}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: isDark ? '#111' : '#fff',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '12px',
                                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)'
                                        }}
                                        formatter={(value) => [`${new Intl.NumberFormat('es-ES').format(value)} €`]}
                                    />
                                    <Area type="monotone" dataKey="balance" name="Valor Total" stroke="#eab308" fillOpacity={1} fill="url(#colorBalance)" strokeWidth={3} />
                                    <Area type="monotone" dataKey="invested" name="Principal" stroke="#666" fill="#333" fillOpacity={0.1} strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompoundInterestCalculator;
