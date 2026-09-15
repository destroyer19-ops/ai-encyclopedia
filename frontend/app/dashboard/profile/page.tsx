import { Button } from "@/components/ui/Button";
import { User, Mail, Shield, Bell } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-8">Account Settings</h1>
      
      <div className="space-y-8">
        
        {/* Personal Info */}
        <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
            <User className="h-5 w-5 text-slate-400" />
            <h2 className="text-lg font-medium text-slate-900">Personal Information</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input type="text" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" defaultValue="Demo User" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Display Name</label>
                <input type="text" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" defaultValue="learner123" />
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button variant="outline" className="mr-3">Cancel</Button>
              <Button variant="gradient">Save Changes</Button>
            </div>
          </div>
        </div>

        {/* Account Security */}
        <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
            <Shield className="h-5 w-5 text-slate-400" />
            <h2 className="text-lg font-medium text-slate-900">Security & Login</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Email Address</p>
                <p className="text-sm text-slate-500">user@example.com</p>
              </div>
              <Button variant="outline" size="sm">Change</Button>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div>
                <p className="font-medium text-slate-900">Password</p>
                <p className="text-sm text-slate-500">Last changed 30 days ago</p>
              </div>
              <Button variant="outline" size="sm">Update</Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
