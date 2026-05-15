import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Phone, MessageCircle, User, HelpCircle, Code2, Flag, Clock,
         FileText, Users, Rocket, ShieldCheck, AlertTriangle,
         Send, Home, CheckCircle2, Briefcase, BarChart3,
        Facebook, Twitter, Instagram, Linkedin, Youtube, Music, Pin, PenTool, Cloud, Shield, ShoppingBag, ClipboardList } from "lucide-react"

import { useEffect, useState } from "react"
import axios from "axios"
import { API_URL } from "@/config"

export default function UserProfile() {
    const [taskCount, setTaskCount] = useState<string | number>("...")
    const [activities, setActivities] = useState<any[]>([])

    const timeAgo = (date: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        if (seconds < 60) return `${seconds} seconds ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} min ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hours ago`;
        return new Date(date).toLocaleDateString();
    };

    const getIcon = (module: string) => {
        switch (module.toLowerCase()) {
            case 'customer': return <Users className="w-4 h-4" />;
            case 'product': return <ShoppingBag className="w-4 h-4" />;
            case 'order': return <ClipboardList className="w-4 h-4" />;
            default: return <FileText className="w-4 h-4" />;
        }
    };

    const getColor = (action: string) => {
        switch (action.toLowerCase()) {
            case 'create': return 'bg-emerald-500';
            case 'delete': return 'bg-red-500';
            case 'update': return 'bg-sky-500';
            default: return 'bg-primary';
        }
    };

    const formatAction = (action: string) => {
        switch (action.toUpperCase()) {
            case 'LOGIN': return 'LOGGED IN';
            case 'LOGOUT': return 'LOGGED OUT';
            default: return `${action.toUpperCase()}D`;
        }
    };

    useEffect(() => {
        const fetchActivityData = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/activities`)
                setTaskCount(data.length)
                setActivities(data.slice(0, 5))
            } catch (error) {
                console.error("Failed to fetch activities")
                setTaskCount(0)
            }
        }
        fetchActivityData()
    }, [])

    return (
        <div className="user-profile-page">

            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 xl:col-span-12">
                    <Card className="overflow-hidden">

                        {/* Gradient Cover */}
                        <div className="h-[150px] bg-gradient-to-r from-purple-700 to-blue-500" />

                        <CardContent className="flex flex-col sm:flex-row sm:items-center gap-6 p-6">

                            {/* Profile Image */}
                            <div className="relative -mt-16 flex flex-shrink-0 mt-0">
                                <div className="w-28 h-28 rounded-full border-4 border-background shadow-lg bg-muted flex items-center justify-center">
                                    <User className="w-12 h-12 text-muted-foreground" />
                                </div>
                            </div>

                            {/* Profile Info */}
                            <div>
                                <h4 className="text-xl font-semibold uppercase">admin</h4>
                                <p className="text-muted-foreground text-sm font-medium">
                                    System Administrator • Aham Grham • Joined May 2026
                                </p>

                                <div className="flex flex-wrap gap-2 mt-3">
                                    <Badge className="bg-primary text-primary-foreground">
                                        {taskCount} Tasks
                                    </Badge>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="sm:ml-auto flex gap-3">
                                <Button>
                                    <Phone className="w-4 h-4 mr-2" />
                                    Get In Touch
                                </Button>
                                <Button variant="outline">
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Message
                                </Button>
                            </div>

                        </CardContent>
                    </Card>
                </div>

                <div className="col-span-12 xl:col-span-4 space-y-6">
                    <Card>
                        <CardContent className="p-6">

                            <h5 className="mb-4 text-lg font-semibold">About</h5>

                            <div className="space-y-4 text-sm">

                                <div className="flex items-center gap-3">
                                    <User className="w-4 h-4 text-muted-foreground" />
                                    <span><span className="font-medium">Full Name:</span> admin</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <HelpCircle className="w-4 h-4 text-muted-foreground" />
                                    <span><span className="font-medium">Status:</span> Active</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Code2 className="w-4 h-4 text-muted-foreground" />
                                    <span><span className="font-medium">Role:</span> Frontend Developer</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Flag className="w-4 h-4 text-muted-foreground" />
                                    <span><span className="font-medium">Location:</span> Austin, Texas</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <MessageCircle className="w-4 h-4 text-muted-foreground" />
                                    <span><span className="font-medium">Languages:</span> English, Spanish</span>
                                </div>

                            </div>

                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">

                            <h5 className="mb-4 text-lg font-semibold">Contacts</h5>

                            <div className="space-y-4 text-sm">

                                <div className="flex items-center gap-3">
                                    <Phone className="w-4 h-4 text-muted-foreground" />
                                    <span>
                                        <span className="font-medium">Phone:</span> (415) 987-6543
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Clock className="w-4 h-4 text-muted-foreground" />
                                    <span>
                                        <span className="font-medium">Skype:</span> emily.carter
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Send className="w-4 h-4 text-muted-foreground" />
                                    <span>
                                        <span className="font-medium">Email:</span> emily.carter@techhub.com
                                    </span>
                                </div>

                            </div>

                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">

                            <h5 className="mb-4 text-lg font-semibold">Teams</h5>

                            <div className="space-y-5 text-sm">

                                {/* Backend Team */}
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full
                                      bg-red-100 text-red-500 dark:bg-red-500/20 dark:text-red-400">
                                        <Code2 className="w-5 h-5" />
                                    </div>

                                    <div className="flex flex-col">
                                        <span className="font-medium">Backend Developers</span>
                                        <span className="text-muted-foreground text-xs">
                                            126 members
                                        </span>
                                    </div>

                                    <Badge
                                        variant="secondary"
                                        className="ml-auto rounded-full bg-red-100 text-red-500 dark:bg-red-500/20 dark:text-red-400"
                                    >
                                        Backend
                                    </Badge>
                                </div>

                                {/* React Team */}
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400">
                                        <Home className="w-5 h-5" />
                                    </div>

                                    <div className="flex flex-col">
                                        <span className="font-medium">React Developers</span>
                                        <span className="text-muted-foreground text-xs">
                                            98 members
                                        </span>
                                    </div>

                                    <Badge
                                        className="ml-auto rounded-full bg-blue-100 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400"
                                    >
                                        Frontend
                                    </Badge>
                                </div>

                            </div>

                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">

                            <h5 className="mb-4 text-lg font-semibold">Overview</h5>

                            <div className="space-y-4 text-sm">

                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>
                                        <span className="font-medium">Tasks Completed:</span> 18,240
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Briefcase className="w-4 h-4" />
                                    <span>
                                        <span className="font-medium">Active Projects:</span> 12
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <BarChart3 className="w-4 h-4" />
                                    <span>
                                        <span className="font-medium">Performance Score:</span> 92%
                                    </span>
                                </div>

                            </div>

                        </CardContent>
                    </Card>



                </div>

                <div className="col-span-12 xl:col-span-8 space-y-6">
                    <Card>
                        <CardContent className="p-6">

                            <h5 className="mb-6 text-lg font-semibold">Activity Timeline</h5>

                            <div className="relative space-y-8 pl-10 border-l ml-4 py-2">
                                {activities.length === 0 ? (
                                    <p className="text-sm text-muted-foreground italic">No recent activity found.</p>
                                ) : (
                                    activities.map((act) => (
                                        <div key={act._id} className="relative">
                                            <span className={`absolute -left-[56px] flex h-8 w-8 items-center justify-center rounded-full text-white shadow-md ${getColor(act.action)}`}>
                                                {getIcon(act.module)}
                                            </span>
                                            <h6 className="font-semibold">{act.module} {formatAction(act.action)}</h6>
                                            <p className="text-sm text-muted-foreground">
                                                Performed {act.action} action on {act.module} module.
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-2">{timeAgo(act.createdAt)}</p>
                                        </div>
                                    ))
                                )}
                            </div>

                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-12 gap-6">


                    <div className="col-span-12 xl:col-span-12">
                        <Card>
                            <CardContent className="p-6">

                                <h5 className="mb-6 text-lg font-semibold">Support</h5>

                                <div className="space-y-5">

                                    {/* Data Analysts */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
                                            <BarChart3 className="w-5 h-5" />
                                        </div>

                                        <div className="flex flex-col">
                                            <span className="font-semibold">Data Analysts</span>
                                            <span className="text-xs text-muted-foreground">
                                                54 members
                                            </span>
                                        </div>

                                        <Badge className="ml-auto rounded-full bg-amber-500/10 text-amber-500 hover:bg-amber-500/20">
                                            Analytics
                                        </Badge>
                                    </div>

                                    {/* Cybersecurity */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                                            <Shield className="w-5 h-5" />
                                        </div>

                                        <div className="flex flex-col">
                                            <span className="font-semibold">Cybersecurity Team</span>
                                            <span className="text-xs text-muted-foreground">
                                                31 members
                                            </span>
                                        </div>

                                        <Badge variant="secondary" className="ml-auto rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20">
                                            Security
                                        </Badge>
                                    </div>

                                    {/* DevOps */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/10 text-sky-500">
                                            <Cloud className="w-5 h-5" />
                                        </div>

                                        <div className="flex flex-col">
                                            <span className="font-semibold">DevOps Engineers</span>
                                            <span className="text-xs text-muted-foreground">
                                                42 members
                                            </span>
                                        </div>

                                        <Badge className="ml-auto rounded-full bg-sky-500/10 text-sky-500 hover:bg-sky-500/20">
                                            Infrastructure
                                        </Badge>
                                    </div>

                                    {/* Content Writers */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                                            <PenTool className="w-5 h-5" />
                                        </div>

                                        <div className="flex flex-col">
                                            <span className="font-semibold">Content Writers</span>
                                            <span className="text-xs text-muted-foreground">
                                                25 members
                                            </span>
                                        </div>

                                        <Badge className="ml-auto rounded-full bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">
                                            Content
                                        </Badge>
                                    </div>

                                    {/* Product Managers */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <Rocket className="w-5 h-5" />
                                        </div>

                                        <div className="flex flex-col">
                                            <span className="font-semibold">Product Managers</span>
                                            <span className="text-xs text-muted-foreground">
                                                17 members
                                            </span>
                                        </div>

                                        <Badge className="ml-auto rounded-full bg-primary/10 text-primary hover:bg-primary/20">
                                            Strategy
                                        </Badge>
                                    </div>

                                </div>

                                <Button variant="link" className="mt-6 px-0">
                                    View all teams
                                </Button>

                            </CardContent>
                        </Card>
                    </div>

                    </div>


                </div>

             </div>  {/* end grid */}

        </div>
    )
}
