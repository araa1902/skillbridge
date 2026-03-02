import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase";
import { ReferenceCard } from "@/components/ReferenceCard";
import { Star, Medal as Award, Buildings as Building2, MapPin, ArrowLeft, Briefcase, Envelope as Mail, User, Calendar } from "@phosphor-icons/react";

export default function StudentProfileView() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [profile, setProfile] = useState<any>(null);
    const [credentials, setCredentials] = useState<any[]>([]);
    const [references, setReferences] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadData() {
            if (!id) return;
            setLoading(true);
            setError(null);
            try {
                // Fetch profile
                const { data: profData, error: profErr } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", id)
                    .single();

                if (profErr) throw profErr;
                setProfile(profData);

                // Fetch credentials
                const { data: credData, error: credErr } = await supabase
                    .from("credentials")
                    .select(`
            *,
            projects ( title )
          `)
                    .eq("student_id", id)
                    .order("issued_at", { ascending: false });

                if (!credErr) {
                    setCredentials(credData ?? []);
                }

                // Fetch references
                const { data: refData, error: refErr } = await supabase
                    .from("employer_references")
                    .select("*")
                    .eq("student_id", id)
                    .eq("is_public", true)
                    .order("created_at", { ascending: false });

                if (!refErr) {
                    setReferences(refData ?? []);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load student profile");
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
                <div className="space-y-6 w-full page-container">
                    <Skeleton className="h-64 w-full rounded-xl" />
                    <Skeleton className="h-40 w-full rounded-xl" />
                    <Skeleton className="h-40 w-full rounded-xl" />
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Card className="max-w-md w-full mx-4 shadow-lg border-red-100">
                    <CardContent className="p-8 text-center text-red-600">
                        <h2 className="text-xl font-bold mb-2">Error Loading Profile</h2>
                        <p className="text-sm opacity-90">{error || "Student not found"}</p>
                        <Button className="mt-6 w-full" variant="outline" onClick={() => navigate(-1)}>
                            Go Back
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Calculate stats
    const totalReferences = references.length;
    const avgRating = totalReferences > 0
        ? (references.reduce((s, r) => s + r.rating, 0) / totalReferences).toFixed(1)
        : "0";

    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            <header className="bg-white border-b sticky top-0 z-10">
                <div className="page-container py-4">
                    <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="hover:bg-gray-100 transition-colors">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                </div>
            </header>

            <main className="page-container py-8 space-y-8">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                        <div className="h-32 w-32 bg-white/20 rounded-full flex items-center justify-center shadow-inner backdrop-blur-sm border-2 border-white/30">
                            <User className="h-16 w-16 text-white drop-shadow-md" />
                        </div>
                        <div className="flex-1 text-center md:text-left space-y-4">
                            <div>
                                <h1 className="text-4xl sm:text-5xl font-extrabold mb-2 tracking-tight drop-shadow-sm text-white">{profile.full_name}</h1>
                                <p className="text-blue-100 font-medium text-lg flex items-center justify-center md:justify-start gap-2">
                                    <Briefcase className="h-5 w-5" /> Student
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none py-1.5 px-3">
                                    <Award className="h-4 w-4 mr-1.5" /> {credentials.length} Credentials
                                </Badge>
                                {totalReferences > 0 && (
                                    <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none py-1.5 px-3">
                                        <Star className="h-4 w-4 mr-1.5 fill-current" /> {avgRating} Avg Rating
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column (About & Skills) */}
                    <div className="space-y-8 lg:col-span-1">
                        <Card className="border-none shadow-md overflow-hidden transition-all hover:shadow-lg">
                            <div className="h-1.5 w-full bg-blue-500"></div>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5 text-blue-500" /> About
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {profile.bio || "No bio provided."}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-md overflow-hidden transition-all hover:shadow-lg">
                            <div className="h-1.5 w-full bg-indigo-500"></div>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Award className="h-5 w-5 text-indigo-500" /> Skills
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {profile.skills && profile.skills.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {profile.skills.map((skill: string, i: number) => (
                                            <Badge key={i} variant="secondary" className="bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 px-3 py-1">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic">No skills listed</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column (Credentials & References) */}
                    <div className="space-y-8 lg:col-span-2">

                        {/* Credentials */}
                        <Card className="border-none shadow-md overflow-hidden relative">
                            <div className="absolute right-0 top-0 w-32 h-32 bg-purple-50 rounded-bl-full -z-10 opacity-70"></div>
                            <CardHeader className="pb-4 border-b border-gray-50/50">
                                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                    <Award className="h-6 w-6 text-purple-600" /> Earned Credentials
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                {credentials.length > 0 ? (
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {credentials.map((cred) => (
                                            <div key={cred.id} className="p-5 border border-purple-100 rounded-xl bg-gradient-to-br from-white to-purple-50/30 hover:shadow-md transition-shadow group relative overflow-hidden">
                                                <div className="absolute top-0 left-0 w-1 h-full bg-purple-500 group-hover:w-1.5 transition-all"></div>
                                                <div className="pl-3">
                                                    <p className="font-semibold text-lg text-gray-900 mb-1 group-hover:text-purple-700 transition-colors">{cred.projects?.title || "Project"}</p>
                                                    <div className="flex items-center gap-1.5 mb-3">
                                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                        <span className="text-sm font-medium text-gray-700">{cred.rating}/5</span>
                                                    </div>
                                                    {cred.skills_verified && cred.skills_verified.length > 0 && (
                                                        <div className="mt-3 flex flex-wrap gap-1.5">
                                                            {cred.skills_verified.map((skill: string, i: number) => (
                                                                <Badge key={i} variant="outline" className="text-xs bg-white text-gray-600 border-gray-200 shadow-sm">
                                                                    {skill}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    )}
                                                    <p className="text-xs text-gray-500 mt-4 flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" /> Issued {new Date(cred.issued_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                                        <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500 font-medium">No credentials earned yet.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* References */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
                                <Star className="h-6 w-6 text-yellow-500" /> Public References
                            </h2>
                            {references.length > 0 ? (
                                <div className="grid gap-6">
                                    {references.map((ref) => (
                                        <div className="transform transition-all duration-300 hover:-translate-y-1" key={ref.id}>
                                            <ReferenceCard reference={ref} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <Card className="border-none shadow-sm bg-gray-50/80">
                                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                        <Briefcase className="w-16 h-16 text-gray-300 mb-4" />
                                        <p className="text-gray-600 font-medium text-lg">No public references available.</p>
                                        <p className="text-gray-400 text-sm mt-2 max-w-sm mx-auto">This student hasn't received any public references from employers yet.</p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
