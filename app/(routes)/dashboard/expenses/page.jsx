"use client";
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Calculator, Filter, Plus, Send, Download, TrendingUp, Calendar, DollarSign, BarChart2, Gift, Plane, Lightbulb, Film } from 'lucide-react';

export default function ExpensesPage() {
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [chartView, setChartView] = useState('category'); 
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      try {
        // GET request to fetch expenses
        const response = await fetch('https://a8d1-103-207-59-158.ngrok-free.app/expenses/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error('API response was not ok');
        const data = await response.json();
        setExpenseData(data);
        console.log('Expense data from external API:', data);
      } catch (externalError) {
        console.error('Error fetching from external API directly:', externalError);
        try {
          // Fallback to local API route
          const localResponse = await fetch('/api/expenses', {
            method: 'GET',
          });
          if (!localResponse.ok) throw new Error('Local API response was not ok');
          const localData = await localResponse.json();
          setExpenseData(localData);
          console.log('Expense data from local API route:', localData);
        } catch (localError) {
          console.error('Error fetching from local API route:', localError);
          setError('Failed to load expense data. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const totalExpenseAmount = expenseData.reduce((sum, expense) => sum + expense.amount, 0);
  const totalBudget = 50000;
  const remainingBudget = totalBudget - totalExpenseAmount;

  const calculateCategoryData = () => {
    const categoryMap = {};
    expenseData.forEach(expense => {
      if (categoryMap[expense.category]) {
        categoryMap[expense.category] += expense.amount;
      } else {
        categoryMap[expense.category] = expense.amount;
      }
    });
    return Object.keys(categoryMap).map(category => ({
      name: category,
      value: categoryMap[category],
      percentage: ((categoryMap[category] / totalExpenseAmount) * 100).toFixed(1)
    }));
  };

  const calculateMonthlyData = () => {
    const monthlyMap = {};
    expenseData.forEach(expense => {
      const date = new Date(expense.date);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      if (monthlyMap[monthYear]) {
        monthlyMap[monthYear] += expense.amount;
      } else {
        monthlyMap[monthYear] = expense.amount;
      }
    });

    // Convert to array and sort by date
    return Object.keys(monthlyMap)
      .map(month => ({
        name: month,
        value: monthlyMap[month]
      }))
      .sort((a, b) => {
        const [aMonth, aYear] = a.name.split(' ');
        const [bMonth, bYear] = b.name.split(' ');
        const aDate = new Date(`${aMonth} 1, ${aYear}`);
        const bDate = new Date(`${bMonth} 1, ${bYear}`);
        return aDate - bDate;
      });
  };

  const calculateWeeklyData = () => {
    const weeklyMap = {};
    expenseData.forEach(expense => {
      const date = new Date(expense.date);
      const week = getWeekNumber(date);
      const weekLabel = `Week ${week}`;
      if (weeklyMap[weekLabel]) {
        weeklyMap[weekLabel] += expense.amount;
      } else {
        weeklyMap[weekLabel] = expense.amount;
      }
    });
    
    return Object.keys(weeklyMap)
      .map(week => ({
        name: week,
        value: weeklyMap[week]
      }))
      .sort((a, b) => {
        const weekA = parseInt(a.name.split(' ')[1]);
        const weekB = parseInt(b.name.split(' ')[1]);
        return weekA - weekB;
      });
  };

  const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const calculateDailySpending = () => {
    const dailyData = {};
    
    // Get last 7 days
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      dailyData[dateString] = 0;
    }
    
    // Fill with actual data
    expenseData.forEach(expense => {
      const expenseDate = expense.date.split('T')[0];
      if (dailyData[expenseDate] !== undefined) {
        dailyData[expenseDate] += expense.amount;
      }
    });
    
    // Convert to array for chart
    return Object.keys(dailyData).map(date => ({
      name: new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).split(', ')[0],
      value: dailyData[date],
      fullDate: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }));
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Convert amount to number
      const expensePayload = {
        ...newExpense,
        amount: parseFloat(newExpense.amount)
      };
      
      // Try the external API first for POST request
      try {
        const externalResponse = await fetch('https://a8d1-103-207-59-158.ngrok-free.app/expenses/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(expensePayload),
        });
        
        if (!externalResponse.ok) throw new Error('External API response was not ok');
        
        const result = await externalResponse.json();
        console.log('Added expense via external API:', result);
        
        // Add the new expense to the state
        setExpenseData(prev => [...prev, result]);
        
        // Reset form and close modal
        resetExpenseForm();
        
      } catch (externalError) {
        console.error('Error with external API:', externalError);
        
        // If external API fails, try the local API route
        const localResponse = await fetch('/api/expenses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(expensePayload),
        });
        
        if (!localResponse.ok) throw new Error('Local API response was not ok');
        
        const localResult = await localResponse.json();
        console.log('Added expense via local API:', localResult);
        
        // Add the new expense to the state
        setExpenseData(prev => [...prev, localResult]);
        
        // Reset form and close modal
        resetExpenseForm();
      }
      
    } catch (error) {
      console.error('Error adding expense:', error);
      setSubmitError('Failed to add expense. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetExpenseForm = () => {
    setNewExpense({
      title: '',
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setShowAddExpenseModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense({
      ...newExpense,
      [name]: value
    });
  };

  const categoryData = calculateCategoryData();
  const monthlyData = calculateMonthlyData();
  const weeklyData = calculateWeeklyData();
  const dailyData = calculateDailySpending();

  const COLORS = ['#1A2B6D', '#4C63B6', '#009688', '#4FD1C5', '#FF5722', '#FF7E67', '#9F7AEA', '#EF4444'];

  const filteredExpenses = expenseData
    .filter(expense => {
      if (filter !== 'all' && expense.category !== filter) return false;
      if (searchTerm && !expense.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !expense.category.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !expense.notes?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortDirection === 'asc' 
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      } else if (sortBy === 'amount') {
        return sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      } else {
        return sortDirection === 'asc' 
          ? a[sortBy].localeCompare(b[sortBy])
          : b[sortBy].localeCompare(a[sortBy]);
      }
    });

  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredExpenses.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const categories = [...new Set(expenseData.map(expense => expense.category))];

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };

  const getTopCategory = () => {
    if (categoryData.length === 0) return { name: 'N/A', value: 0 };
    return categoryData.reduce((max, category) => 
      category.value > max.value ? category : max, { name: '', value: 0 });
  };

  const topCategory = getTopCategory();

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'gifts':
        return <Gift size={18} className="text-pink-600 mr-2" />;
      case 'travel':
        return <Plane size={18} className="text-blue-600 mr-2" />;
      case 'utilities':
        return <Lightbulb size={18} className="text-yellow-600 mr-2" />;
      case 'entertainment':
        return <Film size={18} className="text-purple-600 mr-2" />;
      default:
        return <div 
          className="w-4 h-4 rounded-full mr-2" 
          style={{ backgroundColor: COLORS[categoryData.findIndex(c => c.name === category) % COLORS.length] }}
        ></div>;
    }
  };

  const renderChart = () => {
    let data;
    let title;
    
    switch(chartView) {
      case 'monthly':
        data = monthlyData;
        title = 'Monthly Expenses';
        break;
      case 'weekly':
        data = weeklyData;
        title = 'Weekly Expenses';
        break;
      case 'category':
      default:
        data = categoryData;
        title = 'Expenses by Category';
    }
    
    return (
      <>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-[#2D3748]">{title}</h3>
          <div className="flex space-x-2">
            <button 
              onClick={() => setChartView('category')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                chartView === 'category' ? 'bg-[#1A2B6D] text-white' : 'bg-gray-200 text-[#2D3748]'
              }`}
            >
              Category
            </button>
            <button 
              onClick={() => setChartView('monthly')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                chartView === 'monthly' ? 'bg-[#1A2B6D] text-white' : 'bg-gray-200 text-[#2D3748]'
              }`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setChartView('weekly')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                chartView === 'weekly' ? 'bg-[#1A2B6D] text-white' : 'bg-gray-200 text-[#2D3748]'
              }`}
            >
              Weekly
            </button>
          </div>
        </div>
        
        {chartView === 'category' ? (
          <div className="flex flex-col md:flex-row">
            <div className="w-full h-64 md:h-80 md:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    strokeWidth={2}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend wrapperStyle={{ fontSize: '14px', fontWeight: 500 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full h-64 md:h-80 md:w-1/2 mt-6 md:mt-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    tick={{ fill: '#2D3748', fontSize: 12 }}
                    height={70}
                  />
                  <YAxis tick={{ fill: '#2D3748', fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{ backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}
                  />
                  <Bar dataKey="value" fill="#1A2B6D" radius={[4, 4, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="w-full h-72 md:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  tick={{ fill: '#2D3748', fontSize: 12 }}
                  height={70}
                />
                <YAxis tick={{ fill: '#2D3748', fontSize: 12 }} />
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}
                />
                <Bar dataKey="value" fill="#1A2B6D" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </>
    );
  };

  return (
    <DashboardLayout title="Expense Tracker">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-[#2D3748]">Track Your Expenses</h2>
          <p className="text-[#4A5568] text-lg mt-1">Manage your budget effectively</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button 
            className="bg-[#1A2B6D] text-white px-5 py-3 rounded-lg hover:bg-[#4C63B6] transition-all flex items-center text-lg font-semibold shadow-lg transform hover:scale-105 duration-300"
            onClick={() => setShowAddExpenseModal(true)}
          >
            <Plus size={20} className="mr-2" /> Add Expense
          </button>
          <button className="bg-[#009688] text-white px-5 py-3 rounded-lg hover:bg-[#00796B] transition-all flex items-center text-lg font-semibold shadow-lg transform hover:scale-105 duration-300">
            <Download size={20} className="mr-2" /> Export
          </button>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl mx-4">
            <h3 className="text-2xl font-bold text-[#2D3748] mb-6">Add New Expense</h3>
            
            {submitError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                {submitError}
              </div>
            )}
            
            <form onSubmit={handleAddExpense}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-[#2D3748] font-medium mb-2" htmlFor="title">
                    Expense Title*
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-[#2D3748]"
                    placeholder="e.g., Grocery Shopping"
                    value={newExpense.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-[#2D3748] font-medium mb-2" htmlFor="amount">
                    Amount (₹)*
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    min="0"
                    step="0.01"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-[#2D3748]"
                    placeholder="0.00"
                    value={newExpense.amount}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-[#2D3748] font-medium mb-2" htmlFor="category">
                    Category*
                  </label>
                  <select
                    id="category"
                    name="category"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-[#2D3748] bg-white"
                    value={newExpense.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled>Select a category</option>
                    {categories.length > 0 ? (
                      categories.map((category, index) => (
                        <option key={index} value={category}>{category}</option>
                      ))
                    ) : (
                      <>
                        <option value="Food">Food</option>
                        <option value="Transportation">Transportation</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Gifts">Gifts</option>
                        <option value="Travel">Travel</option>
                        <option value="Other">Other</option>
                      </>
                    )}
                  </select>
                </div>
                
                <div>
                  <label className="block text-[#2D3748] font-medium mb-2" htmlFor="date">
                    Date*
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-[#2D3748]"
                    value={newExpense.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-[#2D3748] font-medium mb-2" htmlFor="notes">
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-[#2D3748]"
                  placeholder="Add any additional details here..."
                  value={newExpense.notes}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-6 py-3 bg-[#F9FAFB] text-[#2D3748] rounded-lg font-medium hover:bg-[#EBF4FF] transition-all"
                  onClick={() => setShowAddExpenseModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#1A2B6D] text-white rounded-lg font-medium hover:bg-[#4C63B6] transition-all flex items-center transform hover:scale-105"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Plus size={18} className="mr-2" /> Add Expense
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-8 rounded-xl shadow-lg text-[#2D3748] border-l-4 border-l-[#009688] transition-all hover:shadow-xl hover:scale-105 duration-300">
          <div className="flex items-center mb-3">
            <DollarSign size={24} className="text-[#009688] mr-3" />
            <h3 className="text-xl font-bold">Total Budget</h3>
          </div>
          <p className="text-4xl font-extrabold mt-3">{formatCurrency(totalBudget)}</p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg text-[#2D3748] border-l-4 border-l-[#1A2B6D] transition-all hover:shadow-xl hover:scale-105 duration-300">
          <div className="flex items-center mb-3">
            <TrendingUp size={24} className="text-[#1A2B6D] mr-3" />
            <h3 className="text-xl font-bold">Expenses So Far</h3>
          </div>
          <p className="text-4xl font-extrabold mt-3">{formatCurrency(totalExpenseAmount)}</p>
          <p className="text-base mt-2 font-semibold text-[#4A5568]">{((totalExpenseAmount/totalBudget)*100).toFixed(1)}% of budget</p>
        </div>
        <div className={`bg-white p-8 rounded-xl shadow-lg text-[#2D3748] border-l-4 ${remainingBudget >= 0 ? 'border-l-[#9F7AEA]' : 'border-l-[#FF5722]'} transition-all hover:shadow-xl hover:scale-105 duration-300`}>
          <div className="flex items-center mb-3">
            <Calculator size={24} className={`${remainingBudget >= 0 ? 'text-[#9F7AEA]' : 'text-[#FF5722]'} mr-3`} />
            <h3 className="text-xl font-bold">{remainingBudget >= 0 ? 'Remaining' : 'Over Budget'}</h3>
          </div>
          <p className="text-4xl font-extrabold mt-3">{formatCurrency(Math.abs(remainingBudget))}</p>
          <p className="text-base mt-2 font-semibold text-[#4A5568]">{remainingBudget >= 0 ? 'Available to spend' : 'Budget exceeded'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
        <div className="md:col-span-8 bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#1A2B6D]"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-6 rounded-lg text-red-800 text-center text-lg font-medium border-2 border-red-200">
              {error}
            </div>
          ) : (
            renderChart()
          )}
        </div>

        <div className="md:col-span-4 bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <h3 className="text-2xl font-bold mb-6 text-[#2D3748] flex items-center">
            <BarChart2 size={24} className="mr-3 text-[#1A2B6D]" />
            Expense Insights
          </h3>

          <div className="space-y-8">
            <div className="p-6 bg-[#E6FFFA] rounded-lg border border-[#B2F5EA]">
              <h4 className="font-semibold text-lg mb-2 text-[#2D3748]">Top Expense Category</h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-3" 
                    style={{ backgroundColor: COLORS[0] }}
                  ></div>
                  <span className="text-xl font-bold text-[#2D3748]">{topCategory.name}</span>
                </div>
                <span className="text-xl font-bold text-[#2D3748]">{formatCurrency(topCategory.value)}</span>
              </div>
              <p className="text-base mt-1 text-[#4A5568]">
                {((topCategory.value / totalExpenseAmount) * 100).toFixed(1)}% of total expenses
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4 text-[#2D3748]">Recent Daily Spending</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dailyData}
                    margin={{ top: 5, right: 5, left: 5, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#2D3748', fontSize: 12 }}
                    />
                    <YAxis tick={{ fill: '#2D3748', fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value) => formatCurrency(value)}
                      labelFormatter={(label, items) => items[0]?.payload?.fullDate}
                      contentStyle={{ backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}
                    />
                    <Bar dataKey="value" fill="#1A2B6D" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="flex items-center justify-between p-5 bg-[#E9D8FD] rounded-lg border border-[#D6BCFA]">
              <div>
                <p className="text-base font-medium text-[#4A5568]">Average Daily Expense</p>
                <p className="text-2xl font-bold text-[#2D3748]">
                  {formatCurrency(totalExpenseAmount / (expenseData.length ? expenseData.length : 1))}
                </p>
              </div>
              <Calculator size={28} className="text-[#9F7AEA]" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 border border-[#E2E8F0] mb-10 transition-all hover:shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h3 className="text-2xl font-bold text-[#2D3748] flex items-center">
            <Calendar size={24} className="mr-3 text-[#1A2B6D]" />
            Recent Expenses
          </h3>
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 mt-4 md:mt-0 w-full md:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search expenses..."
                className="pl-4 pr-10 py-3 border border-gray-300 rounded-lg w-full md:w-64 text-[#2D3748] text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="pl-4 pr-10 py-3 border border-gray-300 rounded-lg bg-white text-[#2D3748] text-base font-medium"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#1A2B6D]"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-6 rounded-lg text-red-800 text-center text-lg font-medium border-2 border-red-200">
            {error}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th 
                      className="px-6 py-4 text-left text-sm font-bold text-[#2D3748] uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                      onClick={() => handleSortChange('date')}
                    >
                      Date {sortBy === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-sm font-bold text-[#2D3748] uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                      onClick={() => handleSortChange('category')}
                    >
                      Category {sortBy === 'category' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-sm font-bold text-[#2D3748] uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                      onClick={() => handleSortChange('title')}
                    >
                      Description {sortBy === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="px-6 py-4 text-right text-sm font-bold text-[#2D3748] uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                      onClick={() => handleSortChange('amount')}
                    >
                      Amount {sortBy === 'amount' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.length > 0 ? (
                    currentItems.map((expense) => (
                      <tr key={expense.id} className="hover:bg-gray-50">
                        <td className="px-6 py-5 whitespace-nowrap text-base text-[#2D3748]">{formatDate(expense.date)}</td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className="px-3 py-1.5 text-sm font-semibold rounded-full bg-[#E6FFFA] text-[#009688] border border-[#B2F5EA]">
                            {expense.category}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="font-semibold text-base text-[#2D3748]">{expense.title}</div>
                          {expense.notes && (
                            <div className="text-sm text-[#4A5568] mt-1">{expense.notes}</div>
                          )}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-right font-bold text-lg text-[#2D3748]">
                          {formatCurrency(expense.amount)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-gray-500 text-lg font-medium">
                        No expenses found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex justify-between items-center">
                <div className="text-base text-[#4A5568] font-medium">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredExpenses.length)} of {filteredExpenses.length} expenses
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border rounded font-medium bg-white disabled:opacity-50 text-[#2D3748] text-base"
                  >
                    Previous
                  </button>
                  {[...Array(Math.min(totalPages, 5)).keys()].map(number => (
                    <button
                      key={number}
                      onClick={() => handlePageChange(number + 1)}
                      className={`px-4 py-2 border rounded font-bold text-base ${
                        currentPage === number + 1 ? 'bg-[#1A2B6D] text-white border-[#1A2B6D]' : 'bg-white text-[#2D3748]'
                      }`}
                    >
                      {number + 1}
                    </button>
                  ))}
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <span className="px-4 py-2 text-[#2D3748]">...</span>
                  )}
                  {totalPages > 5 && currentPage < totalPages && (
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      className={`px-4 py-2 border rounded font-bold text-base ${
                        currentPage === totalPages ? 'bg-[#1A2B6D] text-white border-[#1A2B6D]' : 'bg-white text-[#2D3748]'
                      }`}
                    >
                      {totalPages}
                    </button>
                  )}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border rounded font-medium bg-white disabled:opacity-50 text-[#2D3748] text-base"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="bg-white rounded-lg shadow-lg p-8 border border-[#E2E8F0]">
          <h3 className="text-2xl font-bold mb-6 flex items-center text-[#2D3748]">
            <Calculator size={24} className="mr-3 text-[#1A2B6D]" />
            Monthly Analysis
          </h3>
          <div className="space-y-8">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData.slice(-6)} // Show last 6 months
                  margin={{ top: 5, right: 30, left: 20, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    tick={{ fill: '#2D3748', fontSize: 12 }}
                    height={60}
                  />
                  <YAxis tick={{ fill: '#2D3748', fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{ backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}
                  />
                  <Bar dataKey="value" fill="#9F7AEA" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-[#E6FFFA] rounded-lg border-2 border-[#B2F5EA]">
                <h4 className="font-bold text-lg mb-2 text-[#2D3748]">Top Spending Month</h4>
                <p className="text-xl font-bold text-[#2D3748]">{monthlyData.length > 0 ? monthlyData.reduce((max, month) => month.value > max.value ? month : max, { name: 'N/A', value: 0 }).name : 'N/A'}</p>
                <p className="font-extrabold text-xl text-[#009688] mt-2">
                  {monthlyData.length > 0 ? formatCurrency(monthlyData.reduce((max, month) => month.value > max.value ? month : max, { value: 0 }).value) : '₹0'}
                </p>
              </div>
              
              <div className="p-5 bg-[#E9D8FD] rounded-lg border-2 border-[#D6BCFA]">
                <h4 className="font-bold text-lg mb-2 text-[#2D3748]">Monthly Average</h4>
                <p className="text-base font-medium text-[#4A5568]">Average expense per month</p>
                <p className="font-extrabold text-xl text-[#9F7AEA] mt-2">
                  {monthlyData.length > 0 ? formatCurrency(monthlyData.reduce((sum, month) => sum + month.value, 0) / monthlyData.length) : '₹0'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8 border border-[#E2E8F0]">
          <h3 className="text-2xl font-bold mb-6 flex items-center text-[#2D3748]">
            <Send size={24} className="mr-3 text-[#1A2B6D]" />
            Shared Expenses
          </h3>
          <div className="space-y-5">
            {[
              { name: 'Rahul', amount: '₹4,500', status: 'Paid', date: '28 Mar' },
              { name: 'Priya', amount: '₹3,200', status: 'Pending', date: '30 Mar' },
              { name: 'Amit', amount: '₹5,100', status: 'Paid', date: '2 Apr' },
              { name: 'Sneha', amount: '₹2,800', status: 'Pending', date: '3 Apr' },
            ].map((person, index) => (
              <div key={index} className="flex justify-between items-center p-4 border border-[#E2E8F0] rounded-lg hover:bg-gray-50">
                <div className="flex items-center">
                  <div className="bg-[#E6FFFA] text-[#009688] rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg mr-4 border border-[#B2F5EA]">
                    {person.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-lg text-[#2D3748]">{person.name}</p>
                    <p className="text-base text-[#4A5568]">Due {person.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-[#2D3748]">{person.amount}</p>
                  <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${
                    person.status === 'Paid' ? 'bg-[#C6F6D5] text-[#38A169] border border-[#9AE6B4]' : 'bg-[#FEFCBF] text-[#D69E2E] border border-[#FAF089]'
                  }`}>
                    {person.status}
                  </span>
                </div>
              </div>
            ))}
            <button className="mt-4 bg-[#1A2B6D] text-white px-6 py-3 rounded hover:bg-[#4C63B6] transition-all w-full flex items-center justify-center text-lg font-bold shadow-md">
              <Send size={18} className="mr-2" /> Send Reminders
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 border border-[#E2E8F0] mb-10">
        <h3 className="text-2xl font-bold mb-6 flex items-center text-[#2D3748]">
          <BarChart2 size={24} className="mr-3 text-[#1A2B6D]" />
          Category Comparison
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={categoryData}
              margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
              barSize={40}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                tick={{ fill: '#2D3748', fontSize: 12 }}
                height={70}
              />
              <YAxis tick={{ fill: '#2D3748', fontSize: 12 }} />
              <Tooltip 
                formatter={(value) => formatCurrency(value)}
                contentStyle={{ backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
          {categoryData.slice(0, 4).map((category, index) => (
            <div key={index} className="p-4 bg-[#F7FAFC] rounded-lg border border-[#E2E8F0] hover:shadow-md transition-shadow">
              <div className="flex items-center mb-2">
                {getCategoryIcon(category.name)}
                <h4 className="font-bold text-[#2D3748]">{category.name}</h4>
              </div>
              <p className="text-xl font-extrabold text-[#2D3748]">{formatCurrency(category.value)}</p>
              <p className="text-sm font-medium text-[#4A5568] mt-1">{category.percentage}% of total</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}