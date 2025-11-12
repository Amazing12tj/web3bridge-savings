import React, { useState } from "react";

const TIERS = {
  tier1: {
    key: "tier1",
    label: "Tier 1 (₦10,000)",
    amount: 10000,
    weeklyRate: 0.05,
  },
  tier2: {
    key: "tier2",
    label: "Tier 2 (₦20,000)",
    amount: 20000,
    weeklyRate: 0.1,
  },
  tier3: {
    key: "tier3",
    label: "Tier 3 (₦30,000)",
    amount: 30000,
    weeklyRate: 0.2,
  },
};

const formatN = (n) =>
  n.toLocaleString(undefined, { maximumFractionDigits: 2 });

export default function App() {
  const [members, setMembers] = useState([]);
  const [name, setName] = useState("");
  const [selectedTier, setSelectedTier] = useState("");

  const totalSaved = members.reduce((sum, m) => sum + m.contribution, 0);

  const addMember = () => {
    if (!name.trim()) return alert("Please enter a student name.");
    if (!selectedTier) return alert("Please select a tier.");
    if (members.length >= 12)
      return alert("Group is full (12 students). Withdraw someone first.");

    const tier = TIERS[selectedTier];
    const newMember = {
      id: Date.now().toString(36),
      name: name.trim(),
      tier: tier.key,
      contribution: tier.amount,
    };
    setMembers([...members, newMember]);
    setName("");
    setSelectedTier("");
  };

  const withdrawMember = (id) => {
    const member = members.find((m) => m.id === id);
    if (!member) return;
    if (
      !confirm(`Withdraw ₦${formatN(member.contribution)} for ${member.name}?`)
    )
      return;
    setMembers(members.filter((m) => m.id !== id));
    alert(
      `${member.name} withdrew ₦${formatN(
        member.contribution
      )} and has been removed.`
    );
  };

  const simulateWeek = () => {
    if (members.length === 0) return alert("No members to simulate.");
    setMembers(
      members.map((m) => {
        const rate = TIERS[m.tier].weeklyRate;
        const newContribution = +(m.contribution * (1 + rate)).toFixed(2);
        return { ...m, contribution: newContribution };
      })
    );
  };

  const resetGroup = () => {
    if (confirm("Reset all members?")) setMembers([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E0F7FA] via-[#F4F8FB] to-white text-slate-900 flex flex-col items-center py-10 px-4 transition-all">
      <div className="max-w-5xl w-full bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-[#D8E0E8] p-8 animate-fadeIn">
        {/* HEADER */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 border-b border-[#D8E0E8] pb-4">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-[#0077B6] to-[#06AED5] bg-clip-text text-transparent">
            💰 Savings Group Dashboard
          </h1>
          <div className="text-sm text-[#023E8A] mt-3 sm:mt-0">
            Members: <span className="font-semibold">{members.length}</span>/12
          </div>
        </header>

        {/* GRID */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Registration */}
          <section className="p-6 bg-[#F8FAFC] rounded-xl border border-[#D8E0E8] shadow-sm hover:shadow-md transition-all duration-200">
            <h2 className="text-xl font-semibold text-[#0077B6] mb-4">
              Student Registration 🧾
            </h2>

            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter student name"
              className="w-full p-2.5 rounded-lg border border-[#D8E0E8] focus:ring-2 focus:ring-[#06AED5] mb-4 outline-none transition-all"
            />

            <label className="block text-sm font-medium text-slate-700 mb-1">
              Select Tier
            </label>
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-[#D8E0E8] focus:ring-2 focus:ring-[#06AED5] mb-4 outline-none transition-all"
            >
              <option value="">-- Choose Tier --</option>
              {Object.values(TIERS).map((t) => (
                <option key={t.key} value={t.key}>
                  {t.label}
                </option>
              ))}
            </select>

            {selectedTier ? (
              <div className="mb-4 p-3 bg-[#E3F2FD] border border-[#90CAF9] rounded-lg text-sm text-[#023E8A]">
                💡 <strong>{TIERS[selectedTier].label}</strong>
                <br />
                Amount: ₦{formatN(TIERS[selectedTier].amount)} <br />
                Weekly Interest:{" "}
                {(TIERS[selectedTier].weeklyRate * 100).toFixed(0)}% <br />
                After 1 Week: ₦
                {formatN(
                  TIERS[selectedTier].amount *
                    (1 + TIERS[selectedTier].weeklyRate)
                )}
              </div>
            ) : (
              <div className="text-sm text-slate-500 mb-4 italic">
                Select a tier to view details.
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={addMember}
                className="flex-1 bg-gradient-to-r from-[#0077B6] to-[#06AED5] text-white px-4 py-2.5 rounded-lg shadow-md hover:opacity-90 transition-all duration-200 hover:scale-[1.02]"
              >
                ➕ Register
              </button>
              <button
                onClick={() => {
                  setName("");
                  setSelectedTier("");
                }}
                className="flex-1 border border-slate-400 hover:bg-slate-100 px-4 py-2.5 rounded-lg transition-all duration-200"
              >
                Clear
              </button>
            </div>

            <hr className="my-6" />

            <div className="space-y-3">
              <button
                onClick={simulateWeek}
                className="w-full bg-gradient-to-r from-[#06AED5] to-[#4ECDC4] text-white px-4 py-2.5 rounded-lg font-semibold shadow hover:opacity-90 transition-all hover:scale-[1.02]"
              >
                ⚡ Simulate 1 Week
              </button>
              <button
                onClick={resetGroup}
                className="w-full bg-gradient-to-r from-[#EF476F] to-[#F3722C] text-white px-4 py-2.5 rounded-lg font-semibold shadow hover:opacity-90 transition-all hover:scale-[1.02]"
              >
                🔄 Reset Group
              </button>
            </div>
          </section>

          {/* Dashboard */}
          <section className="p-6 bg-[#F8FAFC] rounded-xl border border-[#D8E0E8] shadow-sm hover:shadow-md transition-all duration-200">
            <h2 className="text-xl font-semibold text-[#0077B6] mb-4">
              Savings Dashboard 📊
            </h2>

            <div className="mb-4 text-lg font-medium text-[#023E8A]">
              Total Saved: ₦{formatN(totalSaved)}
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {members.length === 0 ? (
                <div className="text-sm text-slate-500 text-center italic">
                  No members yet — register someone to start.
                </div>
              ) : (
                members.map((m, idx) => {
                  const tier = TIERS[m.tier];
                  const interest = +(m.contribution * tier.weeklyRate).toFixed(
                    2
                  );
                  return (
                    <div
                      key={m.id}
                      className="p-4 border border-[#D8E0E8] bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 flex justify-between items-start animate-fadeIn"
                      style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                      <div>
                        <div className="font-semibold text-lg text-[#023E8A]">
                          {m.name}
                        </div>
                        <div className="text-sm text-slate-600 mb-1">
                          {tier.label}
                        </div>
                        <div className="text-sm">
                          💰 Current: ₦{formatN(m.contribution)}
                        </div>
                        <div className="text-sm">
                          📈 Weekly Interest: ₦{formatN(interest)} (
                          {(tier.weeklyRate * 100).toFixed(0)}%)
                        </div>
                        <div className="text-sm">
                          🔮 Next Week: ₦
                          {formatN(m.contribution * (1 + tier.weeklyRate))}
                        </div>
                      </div>
                      <button
                        onClick={() => withdrawMember(m.id)}
                        className="text-sm bg-red-100 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-200 transition-all"
                      >
                        Withdraw
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>

        <footer className="text-center text-slate-500 text-sm mt-10 pt-4 border-t border-[#D8E0E8]">
          Made with ❤️ and 💎 by{" "}
          <span className="font-medium text-[#023E8A]">Mr. Amazing</span> for
          Web3Bridge Cohort XIV
        </footer>
      </div>
    </div>
  );
}
