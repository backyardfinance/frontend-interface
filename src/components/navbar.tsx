import { useLocation, useNavigate } from "react-router";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NavItems } from "@/config/routes";

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname.split("/")[1];
  return (
    <Tabs onValueChange={(val) => navigate(val)} value={`/${currentPath}`}>
      <TabsList>
        {NavItems.map(({ title, path }) => (
          <TabsTrigger key={path} value={path}>
            {title}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
