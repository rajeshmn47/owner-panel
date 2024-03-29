import { motion } from "framer-motion";
import {
  DollarSign,
  Flag,
  LandPlot,
  LayoutGrid,
  MapPinned,
  Star,
  User2,
  WalletCards,
} from "lucide-react";
import { FC } from "react";
import CollapsableDropdown, {
  CollapsableDropdownItem,
} from "./collapsable-dropdown";

interface Props { }

const DashboardLinks = [
  {
    title: "Analytics",
    link: "/dashboard/analytics",
  },
  {
    title: "Report",
    link: "/dashboard/report",
  },
  {
    title: "Corporate Portal",
    link: "/dashboard/corporate-portal",
  },
  {
    title: "Guests",
    link: "/dashboard/guests",
  },
  {
    title: "Billing",
    link: "/dashboard/billing",
  },
  {
    title: "Users",
    link: "/dashboard/users",
  },
  {
    title: "KSR",
    link: "/dashboard/ksr/inventory",
  },
];

const RoomsLinks = [
  {
    title: "All Rooms",
    link: "/rooms",
  },
  {
    title: "Add Room",
    link: "/rooms/add",
  },
];
const PropertyLinks = [
  {
    title: "All Properties",
    link: "/property",
  },
  {
    title: "Add Property",
    link: "/property/add",
  },
];

const BookingLinks = [
  {
    title: "All Bookings",
    link: "/bookings",
  },
  {
    title: "Add Booking",
    link: "/bookings/add",
  },
];

const ComplaintLinks = [
  {
    title: "All Complaints",
    link: "/complaints",
  },
  {
    title: "Add Complaint",
    link: "/complaints/add",
  },
];

const ReviewLinks = [
  {
    title: "All Reviews",
    link: "/reviews",
  },
  {
    title: "Add Review",
    link: "/reviews/add",
  },
];
const UserLinks = [
  {
    title: "create",
    link: "/user/create",
  },
];
const PricingLinks = [
  {
    title: "All Pricing",
    link: "/pricing",
  },
];

const ChannelLinks = [
  {
    title: "All Property",
    link: "/channel/all",
  },
  {
    title: "Add Property",
    link: "/channel/addChannelProperty",
  },
  {
    title: "Add Room Type",
    link: "/channel/addRoomType",
  },
  {
    title: "Add Room Rates",
    link: "/channel/addRoomRates",
  },
  {
    title: "All Room Types",
    link: "/channel/allRoomTypes",
  },
];

const SideBar: FC<Props> = () => {
  return (
    <motion.div
      layout="size"
      className="w-60 min-w-[240px] min-h-[85vh] overflow-hidden flex flex-col p-2 bg-white rounded-lg"
    >
      <motion.div className="flex flex-col gap-1">
        <CollapsableDropdown title="Dashboard" icon={<LayoutGrid size={18} />}>
          {DashboardLinks.map((link, i) => (
            <CollapsableDropdownItem
              key={i}
              title={link.title}
              link={link.link}
            />
          ))}
        </CollapsableDropdown>
        <CollapsableDropdown title="Property" icon={<MapPinned size={18} />}>
          {PropertyLinks.map((link, i) => (
            <CollapsableDropdownItem
              key={i}
              title={link.title}
              link={link.link}
            />
          ))}
        </CollapsableDropdown>
        <CollapsableDropdown title="Rooms" icon={<LandPlot size={18} />}>
          {RoomsLinks.map((link, i) => (
            <CollapsableDropdownItem
              key={i}
              title={link.title}
              link={link.link}
            />
          ))}
        </CollapsableDropdown>
        <CollapsableDropdown title="Bookings" icon={<WalletCards size={18} />}>
          {BookingLinks.map((link, i) => (
            <CollapsableDropdownItem
              key={i}
              title={link.title}
              link={link.link}
            />
          ))}
        </CollapsableDropdown>
        <CollapsableDropdown title="Complaints" icon={<Flag size={18} />}>
          {ComplaintLinks.map((link, i) => (
            <CollapsableDropdownItem
              key={i}
              title={link.title}
              link={link.link}
            />
          ))}
        </CollapsableDropdown>
        <CollapsableDropdown title="Reviews" icon={<Star size={18} />}>
          {ReviewLinks.map((link, i) => (
            <CollapsableDropdownItem
              key={i}
              title={link.title}
              link={link.link}
            />
          ))}
        </CollapsableDropdown>
        <CollapsableDropdown title="User" icon={<User2 size={18} />}>
          {UserLinks.map((link, i) => (
            <CollapsableDropdownItem
              key={i}
              title={link.title}
              link={link.link}
            />
          ))}
        </CollapsableDropdown>
        <CollapsableDropdown
          title="Subscription"
          icon={<DollarSign size={18} />}
        >
          {PricingLinks.map((link, i) => (
            <CollapsableDropdownItem
              key={i}
              title={link.title}
              link={link.link}
            />
          ))}
        </CollapsableDropdown>
        <CollapsableDropdown
          title="Channel"
          icon={<DollarSign size={18} />}
        >
          {ChannelLinks.map((link, i) => (
            <CollapsableDropdownItem
              key={i}
              title={link.title}
              link={link.link}
            />
          ))}
        </CollapsableDropdown>
      </motion.div>
    </motion.div>
  );
};

export default SideBar;
