import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BookOpen, 
  ShoppingBag, 
  Users, 
  ShieldCheck, 
  Settings2, 
  Activity, 
  HelpCircle,
  LayoutDashboard,
  ClipboardList
} from "lucide-react"

export default function Documentation() {
  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Aham Grham Admin Guide</h1>
        <p className="text-muted-foreground mt-2">
          Everything you need to know about managing your platform.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 h-auto gap-2 bg-transparent p-0">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border">
            <LayoutDashboard className="h-4 w-4 mr-2" /> Overview
          </TabsTrigger>
          <TabsTrigger value="ecommerce" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border">
            <ShoppingBag className="h-4 w-4 mr-2" /> eCommerce
          </TabsTrigger>
          <TabsTrigger value="customers" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border">
            <Users className="h-4 w-4 mr-2" /> Customers
          </TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border">
            <Activity className="h-4 w-4 mr-2" /> Activity
          </TabsTrigger>
          <TabsTrigger value="faq" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border">
            <HelpCircle className="h-4 w-4 mr-2" /> FAQ
          </TabsTrigger>
        </TabsList>

        {/* OVERVIEW SECTION */}
        <TabsContent value="overview">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Welcome to Aham Grham Admin
                </CardTitle>
                <CardDescription>
                  A powerful, production-ready dashboard built for modern eCommerce management.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed">
                  The Aham Grham Admin panel is designed to give you total control over your business operations. 
                  From tracking live sales to managing ritual registrations and customer relationships, every tool is accessible via the sidebar.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 rounded-lg border bg-muted/30">
                    <h4 className="font-semibold mb-2">The Sidebar</h4>
                    <p className="text-xs text-muted-foreground">Use the left navigation to switch between eCommerce, Accounts, and Content Control.</p>
                  </div>
                  <div className="p-4 rounded-lg border bg-muted/30">
                    <h4 className="font-semibold mb-2">Theme Control</h4>
                    <p className="text-xs text-muted-foreground">Toggle between Light and Dark modes using the moon/sun icon in the top header.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ECOMMERCE SECTION */}
        <TabsContent value="ecommerce">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Product Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>• <strong>Product List:</strong> View all inventory, edit prices, and update stock status.</p>
                <p>• <strong>Categories:</strong> Organize your products into logical groups for the customer website.</p>
                <p>• <strong>Reviews:</strong> Monitor customer feedback and manage product ratings.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Processing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>• <strong>Live Tracking:</strong> Monitor orders as they come in from the website.</p>
                <p>• <strong>Order Details:</strong> Click on any Order ID to view customer details, shipping address, and purchased items.</p>
                <p>• <strong>Invoicing:</strong> Generate and view invoices for completed transactions.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* CUSTOMERS SECTION */}
        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Customer Relationship Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Viewing Customer Profiles</h4>
                <p className="text-sm text-muted-foreground">
                  In the <strong>Customer List</strong>, you can click on any customer's name to view their full profile. 
                  This includes their contact information, full shipping address, and their registration timeline.
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Safety & Deletion</h4>
                <p className="text-sm text-muted-foreground">
                  When deleting a customer, the system will always ask for confirmation via a secure dialog. 
                  You can delete individual customers or use the bulk-selection checkboxes to remove multiple records at once.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ACTIVITY SECTION */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Security & Activity Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We take security seriously. Every major action performed in this panel is logged for audit purposes.
              </p>
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <h4 className="text-sm font-semibold mb-1">The Activity Footer</h4>
                <p className="text-xs">
                  At the bottom of every page, you'll see the "Last account activity" timestamp. 
                  Click <strong>Details</strong> to see a full log of recent logins, IP addresses, and which modules were accessed.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ SECTION */}
        <TabsContent value="faq">
          <div className="space-y-4">
            {[
              {
                q: "How do I update the ritual registration dates?",
                a: "Navigate to 'Events' or 'Programs' in the sidebar to manage specific ritual content and dates."
              },
              {
                q: "Can I manage the website banners?",
                a: "Yes, use the 'Content Controller' section to update homepage banners and universal site content."
              },
              {
                q: "What should I do if the stats aren't loading?",
                a: "Check the 'Refresh' button on the dashboard. Ensure the backend server is operational (Port 5000)."
              }
            ].map((item, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <h4 className="font-bold text-sm mb-1">{item.q}</h4>
                  <p className="text-xs text-muted-foreground">{item.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center pt-6">
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
          Aham Grham Admin v1.0.4 • Proprietary System
        </p>
      </div>
    </div>
  )
}
