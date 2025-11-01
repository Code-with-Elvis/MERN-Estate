import Account from "@/components/settings/Account";
import ChangePassword from "@/components/settings/ChangePassword";
import DangerZone from "@/components/settings/DangerZone";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Settings = () => {
  return (
    <section className="pb-20">
      <div className="hidden sm:block h-12 bg-[#222]"></div>
      <div className="container pt-10">
        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="danger-zone">Danger Zone</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Account />
          </TabsContent>
          <TabsContent value="password">
            <ChangePassword />
          </TabsContent>
          <TabsContent value="danger-zone">
            <DangerZone />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};
export default Settings;
