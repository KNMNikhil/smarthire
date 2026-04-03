import React, { useState, useEffect, useCallback } from 'react';
import { FileText, Download, User, Briefcase, Code, GraduationCap, Loader, Plus, Trash, Award, Languages, BrainCircuit } from 'lucide-react';
import api from '../../services/authService';

// Move components outside to prevent re-creation on every render
const InputGroup = React.memo(({ label, name, value, onChange, placeholder, type = "text", icon: Icon }) => (
    <div className="space-y-1.5">
        {label && <label className="text-xs font-medium text-gray-400 ml-1">{label}</label>}
        <div className="relative group">
            {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-violet-400 transition-colors" size={18} />}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full bg-neutral-900/50 border border-neutral-800 text-white rounded-xl py-3 ${Icon ? 'pl-10' : 'pl-4'} pr-4 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all placeholder:text-neutral-600`}
            />
        </div>
    </div>
));

const TextAreaGroup = React.memo(({ label, value, onChange, placeholder, height = "h-24" }) => (
    <div className="space-y-1.5">
        {label && <label className="text-xs font-medium text-gray-400 ml-1">{label}</label>}
        <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full bg-neutral-900/50 border border-neutral-800 text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all placeholder:text-neutral-600 resize-none ${height}`}
        />
    </div>
));

const SectionHeader = React.memo(({ icon: Icon, title, subtitle }) => (
    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-800">
        <div className="p-2 bg-violet-500/10 rounded-lg">
            <Icon className="text-violet-400" size={24} />
        </div>
        <div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
            {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
        </div>
    </div>
));

const ResumeScanner = () => {
    const [step, setStep] = useState(1);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState(null);

    // Form Stats - Single Template (Nikhil Style)
    const [formData, setFormData] = useState({
        personalInfo: {
            name: '',
            email: '',
            phone: '',
            linkedin: '',
            github: '',
            portfolio: ''
        },
        education: {
            college: { degree: 'B.E. Computer Science', name: 'Rajalakshmi Engineering College', year: '2026', cgpa: '' },
            grade12: { school: '', year: '', percentage: '' },
            grade10: { school: '', year: '', percentage: '' }
        },
        experience: [], // Internships
        projects: [],
        skills: {
            soft: '', // "Communication, Leadership..."
            technical: {
                languages: '',  // "Java, Python"
                web: '',        // "HTML, React"
                tools: '',      // "Git, VS Code"
                database: ''    // "MySQL, MongoDB"
            }
        },
        spokenLanguages: '', // "English, Telugu..."
        certifications: '',
        achievements: ''
    });

    // Fetch user profile to pre-fill basic info
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/students/profile');
                const user = res.data;
                setFormData(prev => ({
                    ...prev,
                    personalInfo: {
                        ...prev.personalInfo,
                        name: user.name || '',
                        email: user.email || '',
                    },
                    education: {
                        ...prev.education,
                        college: { ...prev.education.college, cgpa: user.cgpa || '' }
                    }
                }));
            } catch (err) {
                console.error("Could not fetch profile", err);
            }
        };
        fetchProfile();
    }, []);

    const handleInfoChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, [name]: value }
        }));
    };

    const handleEduChange = (section, e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            education: {
                ...prev.education,
                [section]: { ...prev.education[section], [name]: value }
            }
        }));
    };

    // Experience (Internships)
    const addExperience = () => {
        setFormData(prev => ({
            ...prev,
            experience: [...prev.experience, { role: '', company: '', description: '' }]
        }));
    };

    const updateExperience = useCallback((index, field, value) => {
        setFormData(prev => {
            const newExp = [...prev.experience];
            newExp[index] = { ...newExp[index], [field]: value };
            return { ...prev, experience: newExp };
        });
    }, []);

    const removeExperience = (index) => {
        setFormData(prev => ({
            ...prev,
            experience: prev.experience.filter((_, i) => i !== index)
        }));
    };

    // Projects
    const addProject = () => {
        setFormData(prev => ({
            ...prev,
            projects: [...prev.projects, { title: '', stack: '', description: '' }]
        }));
    };

    const updateProject = useCallback((index, field, value) => {
        setFormData(prev => {
            const newProj = [...prev.projects];
            newProj[index] = { ...newProj[index], [field]: value };
            return { ...prev, projects: newProj };
        });
    }, []);

    const removeProject = (index) => {
        setFormData(prev => ({
            ...prev,
            projects: prev.projects.filter((_, i) => i !== index)
        }));
    };

    const handleGenerate = async (format = 'pdf') => {
        if (!formData.personalInfo.name || !formData.education.college.name) {
            setError('Please fill in required fields (Name, College)');
            return;
        }

        setGenerating(format);
        setError(null);

        try {
            const endpoint = format === 'pdf' ? '/students/resume' : '/students/resume-word';
            const response = await api.post(endpoint, formData, {
                responseType: 'blob',
                timeout: 60000 // Extended timeout for AI generation
            });

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data], {
                type: format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            }));
            const link = document.createElement('a');
            link.href = url;
            const ext = format === 'pdf' ? 'pdf' : 'docx';
            link.setAttribute('download', `Resume_${formData.personalInfo.name.replace(/\s+/g, '_')}.${ext}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            setError('Failed to generate resume. Please try again.');
            console.error('Generation error:', err);
        } finally {
            setGenerating(false);
        }
    };

    const renderStep1 = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            {/* Personal Details */}
            <div className="bg-neutral-800/30 p-6 rounded-2xl border border-neutral-800/50">
                <SectionHeader icon={User} title="Personal Details" subtitle="Your contact information and social profiles" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup label="Full Name" name="name" value={formData.personalInfo.name} onChange={handleInfoChange} placeholder="e.g. John Doe" />
                    <InputGroup label="Email Address" name="email" value={formData.personalInfo.email} onChange={handleInfoChange} placeholder="e.g. john@example.com" />
                    <InputGroup label="Phone Number" name="phone" value={formData.personalInfo.phone} onChange={handleInfoChange} placeholder="e.g. +91 98765 43210" />
                    <InputGroup label="LinkedIn Profile" name="linkedin" value={formData.personalInfo.linkedin} onChange={handleInfoChange} placeholder="linkedin.com/in/username" />
                    <InputGroup label="GitHub Profile" name="github" value={formData.personalInfo.github} onChange={handleInfoChange} placeholder="github.com/username" />
                    <InputGroup label="Portfolio URL" name="portfolio" value={formData.personalInfo.portfolio} onChange={handleInfoChange} placeholder="yourportfolio.com" />
                </div>
            </div>

            {/* Education */}
            <div className="bg-neutral-800/30 p-6 rounded-2xl border border-neutral-800/50">
                <SectionHeader icon={GraduationCap} title="Education" subtitle="Your academic background" />

                {/* College */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4 text-violet-400">
                        <div className="w-2 h-2 rounded-full bg-violet-400"></div>
                        <h4 className="text-sm font-bold uppercase tracking-wider">Undergraduate (College)</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pl-4 border-l-2 border-neutral-800">
                        <div className="md:col-span-2">
                            <InputGroup label="College Name" name="name" value={formData.education.college.name} onChange={(e) => handleEduChange('college', e)} placeholder="e.g. Rajalakshmi Engineering College" />
                        </div>
                        <InputGroup label="Degree" name="degree" value={formData.education.college.degree} onChange={(e) => handleEduChange('college', e)} placeholder="e.g. B.E. Computer Science" />
                        <div className="grid grid-cols-2 gap-4">
                            <InputGroup label="Year of Passing" name="year" value={formData.education.college.year} onChange={(e) => handleEduChange('college', e)} placeholder="2026" />
                            <InputGroup label="CGPA" name="cgpa" value={formData.education.college.cgpa} onChange={(e) => handleEduChange('college', e)} placeholder="e.g. 9.5" />
                        </div>
                    </div>
                </div>

                {/* 12th */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4 text-violet-400">
                        <div className="w-2 h-2 rounded-full bg-violet-400"></div>
                        <h4 className="text-sm font-bold uppercase tracking-wider">Class 12th (HSC/Inter)</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pl-4 border-l-2 border-neutral-800">
                        <div className="md:col-span-8">
                            <InputGroup label="School Name" name="school" value={formData.education.grade12.school} onChange={(e) => handleEduChange('grade12', e)} placeholder="School Name" />
                        </div>
                        <div className="md:col-span-2">
                            <InputGroup label="Year" name="year" value={formData.education.grade12.year} onChange={(e) => handleEduChange('grade12', e)} placeholder="2022" />
                        </div>
                        <div className="md:col-span-2">
                            <InputGroup label="Percentage" name="percentage" value={formData.education.grade12.percentage} onChange={(e) => handleEduChange('grade12', e)} placeholder="95%" />
                        </div>
                    </div>
                </div>

                {/* 10th */}
                <div>
                    <div className="flex items-center gap-2 mb-4 text-violet-400">
                        <div className="w-2 h-2 rounded-full bg-violet-400"></div>
                        <h4 className="text-sm font-bold uppercase tracking-wider">Class 10th (SSLC)</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pl-4 border-l-2 border-neutral-800">
                        <div className="md:col-span-8">
                            <InputGroup label="School Name" name="school" value={formData.education.grade10.school} onChange={(e) => handleEduChange('grade10', e)} placeholder="School Name" />
                        </div>
                        <div className="md:col-span-2">
                            <InputGroup label="Year" name="year" value={formData.education.grade10.year} onChange={(e) => handleEduChange('grade10', e)} placeholder="2020" />
                        </div>
                        <div className="md:col-span-2">
                            <InputGroup label="Percentage" name="percentage" value={formData.education.grade10.percentage} onChange={(e) => handleEduChange('grade10', e)} placeholder="98%" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            {/* Internships */}
            <div className="bg-neutral-800/30 p-6 rounded-2xl border border-neutral-800/50">
                <SectionHeader icon={Briefcase} title="Experience" subtitle="Internships and Work Experience" />

                <div className="space-y-6">
                    {formData.experience.map((exp, idx) => (
                        <div key={idx} className="bg-neutral-900/50 p-5 rounded-xl border border-neutral-700/50 relative group hover:border-violet-500/30 transition-colors">
                            <button onClick={() => removeExperience(idx)} className="absolute top-4 right-4 text-neutral-600 hover:text-red-400 transition-colors p-1"><Trash size={16} /></button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <InputGroup label="Role / Job Title" value={exp.role} onChange={(e) => updateExperience(idx, 'role', e.target.value)} placeholder="e.g. Frontend Intern" />
                                <InputGroup label="Company Name" value={exp.company} onChange={(e) => updateExperience(idx, 'company', e.target.value)} placeholder="e.g. Google" />
                            </div>
                            <TextAreaGroup label="Description" value={exp.description} onChange={(e) => updateExperience(idx, 'description', e.target.value)} placeholder="Describe your roles and responsibilities..." />
                        </div>
                    ))}

                    <button onClick={addExperience} className="w-full py-3 border-2 border-dashed border-neutral-700 rounded-xl text-neutral-400 hover:text-violet-400 hover:border-violet-500/50 hover:bg-violet-500/5 transition-all flex items-center justify-center gap-2 font-medium">
                        <Plus size={18} /> Add Internship
                    </button>
                </div>
            </div>

            {/* Projects */}
            <div className="bg-neutral-800/30 p-6 rounded-2xl border border-neutral-800/50">
                <SectionHeader icon={Code} title="Projects" subtitle="Showcase your best work" />

                <div className="space-y-6">
                    {formData.projects.map((proj, idx) => (
                        <div key={idx} className="bg-neutral-900/50 p-5 rounded-xl border border-neutral-700/50 relative group hover:border-violet-500/30 transition-colors">
                            <button onClick={() => removeProject(idx)} className="absolute top-4 right-4 text-neutral-600 hover:text-red-400 transition-colors p-1"><Trash size={16} /></button>
                            <div className="grid grid-cols-1 gap-4 mb-4">
                                <InputGroup label="Project Title" value={proj.title} onChange={(e) => updateProject(idx, 'title', e.target.value)} placeholder="e.g. E-Commerce Website" />
                                <InputGroup label="Tech Stack" value={proj.stack} onChange={(e) => updateProject(idx, 'stack', e.target.value)} placeholder="e.g. React, Node.js, MongoDB" />
                            </div>
                            <TextAreaGroup label="Description" value={proj.description} onChange={(e) => updateProject(idx, 'description', e.target.value)} placeholder="Describe the project features and your contribution..." />
                        </div>
                    ))}
                    <button onClick={addProject} className="w-full py-3 border-2 border-dashed border-neutral-700 rounded-xl text-neutral-400 hover:text-violet-400 hover:border-violet-500/50 hover:bg-violet-500/5 transition-all flex items-center justify-center gap-2 font-medium">
                        <Plus size={18} /> Add Project
                    </button>
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="bg-neutral-800/30 p-6 rounded-2xl border border-neutral-800/50">
                <SectionHeader icon={BrainCircuit} title="Technical Skills" subtitle="Technologies you work with" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup label="Programming Languages" value={formData.skills.technical.languages} onChange={(e) => setFormData({ ...formData, skills: { ...formData.skills, technical: { ...formData.skills.technical, languages: e.target.value } } })} placeholder="Java, Python, C++" />
                    <InputGroup label="Web Technologies" value={formData.skills.technical.web} onChange={(e) => setFormData({ ...formData, skills: { ...formData.skills, technical: { ...formData.skills.technical, web: e.target.value } } })} placeholder="React, Node.js, Tailwind" />
                    <InputGroup label="Tools & Platforms" value={formData.skills.technical.tools} onChange={(e) => setFormData({ ...formData, skills: { ...formData.skills, technical: { ...formData.skills.technical, tools: e.target.value } } })} placeholder="Git, Docker, AWS" />
                    <InputGroup label="Databases & Others" value={formData.skills.technical.database} onChange={(e) => setFormData({ ...formData, skills: { ...formData.skills, technical: { ...formData.skills.technical, database: e.target.value } } })} placeholder="MySQL, MongoDB" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-neutral-800/30 p-6 rounded-2xl border border-neutral-800/50">
                    <SectionHeader icon={User} title="Soft Skills" />
                    <TextAreaGroup value={formData.skills.soft} onChange={(e) => setFormData({ ...formData, skills: { ...formData.skills, soft: e.target.value } })} placeholder="Communication, Leadership, Problem Solving..." />
                </div>
                <div className="bg-neutral-800/30 p-6 rounded-2xl border border-neutral-800/50">
                    <SectionHeader icon={Languages} title="Languages" />
                    <TextAreaGroup value={formData.spokenLanguages} onChange={(e) => setFormData({ ...formData, spokenLanguages: e.target.value })} placeholder="English (Native), Spanish (Basic)..." />
                </div>
            </div>

            <div className="bg-neutral-800/30 p-6 rounded-2xl border border-neutral-800/50">
                <SectionHeader icon={Award} title="Certifications & Achievements" />
                <div className="space-y-6">
                    <TextAreaGroup label="Certifications" value={formData.certifications} onChange={(e) => setFormData({ ...formData, certifications: e.target.value })} placeholder="AWS Certified Cloud Practitioner..." height="h-20" />
                    <TextAreaGroup label="Achievements" value={formData.achievements} onChange={(e) => setFormData({ ...formData, achievements: e.target.value })} placeholder="Winner of SmartIndia Hackathon 2023..." height="h-20" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0a0a0a] py-12 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">AI Resume Builder</h1>
                    <p className="text-gray-400 text-lg">Create a professional, ATS-friendly resume in seconds.</p>
                </div>

                {/* Stepper */}
                <div className="mb-12">
                    <div className="flex justify-between items-center relative max-w-2xl mx-auto">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-neutral-800 rounded-full lg:px-12 -z-0"></div>
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-violet-600 rounded-full transition-all duration-500 ease-in-out -z-0"
                            style={{ width: `${((step - 1) / 2) * 100}%` }}></div>

                        {['Basics', 'Experience', 'Skills'].map((label, idx) => {
                            const num = idx + 1;
                            const isActive = step === num;
                            const isCompleted = step > num;

                            return (
                                <div key={num} onClick={() => setStep(num)} className="relative z-10 flex flex-col items-center gap-3 cursor-pointer group">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg transition-all duration-300 shadow-xl
                                        ${isActive ? 'bg-violet-600 text-white shadow-violet-500/25 scale-110' :
                                            isCompleted ? 'bg-neutral-900 text-violet-500 border-2 border-violet-500/50' :
                                                'bg-neutral-900 text-neutral-600 border-2 border-neutral-800 group-hover:border-neutral-700'}`}
                                    >
                                        {isCompleted ? '✓' : num}
                                    </div>
                                    <span className={`text-sm font-semibold tracking-wide transition-colors duration-300 
                                        ${isActive ? 'text-violet-400' : isCompleted ? 'text-gray-400' : 'text-neutral-600'}`}>
                                        {label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Main Form Area */}
                <div className="relative">
                    {/* Content */}
                    <div className="min-h-[400px]">
                        {step === 1 && renderStep1()}
                        {step === 2 && renderStep2()}
                        {step === 3 && renderStep3()}
                    </div>

                    {error && (
                        <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-center font-medium animate-in fade-in slide-in-from-bottom-2">
                            {error}
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between mt-12 pt-8 border-t border-neutral-800">
                        <button
                            onClick={() => setStep(prev => Math.max(1, prev - 1))}
                            disabled={step === 1 || generating}
                            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 
                                ${step === 1 ? 'opacity-0 invisible' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'}`}
                        >
                            Back
                        </button>

                        {step < 3 ? (
                            <button
                                onClick={() => setStep(prev => Math.min(3, prev + 1))}
                                className="group relative px-8 py-3 bg-white text-black rounded-xl font-bold hover:bg-neutral-200 transition-all flex items-center gap-2 overflow-hidden"
                            >
                                <span className="relative z-10">Next Step</span>
                                <div className="w-1 h-1 bg-black rounded-full absolute right-6 opacity-0 group-hover:opacity-10 group-hover:scale-[20] transition-all duration-500"></div>
                            </button>
                        ) : (
                            <div className="flex gap-4">
                                <button
                                    onClick={() => handleGenerate('word')}
                                    disabled={generating}
                                    className="px-6 py-3 bg-neutral-800 text-white border border-neutral-700 rounded-xl font-semibold hover:bg-neutral-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {generating === 'word' ? (
                                        <Loader className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <FileText className="w-5 h-5 text-blue-400" />
                                    )}
                                    <span className="hidden sm:inline">Word</span>
                                </button>
                                <button
                                    onClick={() => handleGenerate('pdf')}
                                    disabled={generating}
                                    className="px-8 py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-600/30 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {generating === 'pdf' ? (
                                        <><Loader className="w-5 h-5 animate-spin" /> Generating...</>
                                    ) : (
                                        <><Download className="w-5 h-5" /> Download PDF</>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeScanner;
