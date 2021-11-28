var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    layout: "/admin",
    for: 'both'
  },
  {
    path: "/classes",
    name: "Classes",
    icon: "ni ni-planet text-blue",
    layout: "/admin",
    for: 'both'

  },
  {
    path: "/weekly-preferences",
    name: "Weekly Preferences",
    icon: "ni ni-planet text-pink",
    layout: "/admin",
    for: 'student'
  },
  {
    path: "/assignments",
    name: "Assignments",
    icon: "ni ni-pin-3 text-orange",
    layout: "/admin",
    for: 'both'
  },
];
export default routes;
