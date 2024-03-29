import Container from "@/components/container";
import ContainerColumn from "@/components/container-column";
import Heading from "@/components/heading";
import { GlobalContextType } from "@/components/providers";
import { Button as ShadcnButton } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SERVER_URL, cn, useGlobalContext } from "@/lib/utils";
import {
  Avatar,
  Button,
  Input,
  Select,
  SelectItem,
  SelectedItems,
  Selection,
} from "@nextui-org/react";
import axios, { AxiosError } from "axios";
import {
  addMonths,
  differenceInMonths,
  endOfMonth,
  format,
  startOfMonth,
} from "date-fns";
import { CalendarIcon } from "lucide-react";
import React, { FC, useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  BookingStatusEnum,
  BookingTypeEnum,
  PaymentMethodEnum,
  PaymentStatusEnum,
  RoomCategoryEnum,
  RoomTypeEnum,
} from "./CONSTS";

type Props = {
  children?: React.ReactNode;
};

interface PropertyProps {
  _id: string;
  name: string;
  type: string;
  location: string;
  address: string;
  coOfLocation: { type: "Point"; coordinates: [number, number] };
  nearbyPlaces?: string[];
  images: { label: string; url: string }[];
  manager?: {
    name: string;
    email: string;
    phoneNumber: string;
  };
  permissions?: string[];
  facilities?: string[];
  isParkingSpaceAvailable?: boolean | "true" | "false" | string;
  isCoupleFriendly?: boolean;
  foodMenu?: FoodMenuProps[];
}

interface FoodMenuProps {
  day: string;
  meals: MealData[];
}

interface MealData {
  name: string;
  hasMealItems?: boolean;
  vegMealItems: string[];
  nonVegMealItems: string[];
}

const AddBooking: FC<Props> = () => {
  const { user } = useGlobalContext() as GlobalContextType;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [property, setProperty] = useState<Selection>(new Set([]));
  const [bookingType, setBookingType] = useState<Selection>(new Set([]));
  const [userProperties, setUserProperties] = useState<PropertyProps[]>();
  const [noOfGuests, setNoOfGuests] = useState<string | undefined>();
  const [roomCategory, setRoomCategory] = useState<Selection>(new Set([]));
  const [roomType, setRoomType] = useState<Selection>(new Set([]));
  const [bookingStatus, setBookingStatus] = useState<Selection>(new Set([]));
  const [paymentMethod, setPaymentMethod] = useState<Selection>(new Set([]));
  const [paymentAmount, setPaymentAmount] = useState<string | undefined>();
  const [primaryGuestName, setPrimaryGuestName] = useState<string>();
  const [guestPhoneNumber, setGuestPhoneNumber] = useState<
    string | undefined
  >();
  const [guestEmail, setGuestEmail] = useState<string>();
  const [checkInMonth, setCheckInMonth] = useState<DateRange | undefined>();
  const [checkInData, setCheckInData] = useState<{
    from: Date | undefined;
    to: Date | undefined;
    months: number;
  }>({
    from: undefined,
    to: undefined,
    months: 0,
  });
  const [paymentStatus, setPaymentStatus] = useState<Selection>(new Set([]));
  const navigate = useNavigate();

  const handleSelectCheckInMonth = (range: DateRange) => {
    console.log(range, "range");
    if (!range.from || !range.to) {
      setCheckInData({
        from: range?.from,
        to: range.to,
        months: 0,
      });
      setCheckInMonth({ ...range });
      return;
    }

    const from: Date = startOfMonth(range.from);
    const to: Date = endOfMonth(range.to);

    // Ensure the range spans full months and is not longer than 6 months
    if (to < addMonths(from, 6) && to >= from) {
      const months: number = differenceInMonths(to, from) + 1;
      setCheckInMonth({ from, to });
      setCheckInData({
        from: range?.from,
        to: range?.to,
        months,
      });
    } else {
      toast.error("Stay duration should be within 6 months only.");
    }
    console.log(checkInMonth, "checkinmonth", checkInData, "checkindata");
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (
      !property ||
      !Array.from(roomCategory).toString() ||
      !Array.from(roomType).toString() ||
      !checkInMonth?.from ||
      !checkInMonth?.to ||
      !Array.from(paymentStatus).toString() ||
      !noOfGuests ||
      !Array.from(bookingType).toString() ||
      !Array.from(bookingStatus).toString() ||
      !primaryGuestName ||
      !guestPhoneNumber
    ) {
      toast.error("Please fill all the fields");
      return;
    }
    setIsLoading(true);
    console.log(user);
    const resObj = {
      propertyId: Array.from(property).toString(),
      roomCategory: Array.from(roomCategory).toString(),
      roomType: Array.from(roomType).toString(),
      from: checkInMonth?.from,
      to: checkInMonth?.to,
      noOfMonths: checkInData?.months,
      paymentStatus: Array.from(paymentStatus).toString(),
      numberOfGuests: parseInt(noOfGuests || "0"),
      paymentAmount: parseInt(paymentAmount || "0"),
      bookingType: Array.from(bookingType).toString(),
      bookingStatus: Array.from(bookingStatus).toString(),
      paymentMethod: Array.from(paymentMethod).toString(),
      primaryGuestName: primaryGuestName || "",
      guestPhoneNumber: parseInt(guestPhoneNumber || "0"),
      guestEmail: guestEmail || "",
      userId: user.userId,
    };
    try {
      const res = await axios.post(
        SERVER_URL + "/user/create-booking",
        resObj,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      const data = await res.data;
      console.log(data);
      toast.success(data.message ?? "Booking created successfully");
      navigate("/bookings");
    } catch (error) {
      const err = error as AxiosError & {
        response: { data: { message: string } };
      };
      console.error(err.response.data.message);
      toast.error(err.response.data.message ?? "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserProperties = async () => {
      try {
        const res = await axios.get(SERVER_URL + "/owner/get-my-properties", {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        const data = await res.data;
        console.log(data);
        setUserProperties(data.properties);
      } catch (error) {
        console.error(error);
      }
    };
    if (user?.token) fetchUserProperties();
  }, [user]);

  return (
    <Container>
      <ContainerColumn>
        <Heading>Add Booking</Heading>
      </ContainerColumn>
      <div className="mt-5 p-5 bg-zinc-50 border rounded-md w-full">
        <Heading variant="subheading">Booking Details</Heading>
        <div className="mt-5 grid md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
          <Select
            name="bookingType"
            color="default"
            label="Booking Type"
            labelPlacement="outside"
            placeholder="Select Booking Type"
            selectedKeys={bookingType}
            onSelectionChange={setBookingType}
            radius="md"
            size="lg"
            variant="bordered"
          >
            {BookingTypeEnum.map((bookingType) => (
              <SelectItem key={bookingType} value={bookingType}>
                {bookingType}
              </SelectItem>
            ))}
          </Select>
          <Select
            items={userProperties || []}
            label="Select Property"
            placeholder="Select a property"
            labelPlacement="outside"
            variant="bordered"
            selectedKeys={property}
            onSelectionChange={setProperty}
            classNames={{
              trigger: "h-12",
            }}
            renderValue={(items: SelectedItems<PropertyProps>) => {
              return items.map((item) => (
                <div key={item.key} className="flex items-center gap-2">
                  <Avatar
                    alt={item.data?.name}
                    className="flex-shrink-0"
                    size="sm"
                    src={item.data?.images[0]?.url}
                  />
                  <div className="flex flex-col">
                    <div className="flex items-center justify-start gap-1">
                      <span>{item.data?.name}</span>
                      <span>({item.data?.type})</span>
                    </div>
                    <span className="text-default-500 text-tiny">
                      ({item.data?.address})
                    </span>
                  </div>
                </div>
              ));
            }}
          >
            {(p) => (
              <SelectItem key={p?._id} textValue={p?.name}>
                <div className="flex gap-2 items-center">
                  <Avatar
                    alt={p?.name}
                    className="flex-shrink-0"
                    size="sm"
                    src={p?.images[0]?.url}
                  />
                  <div className="flex flex-col">
                    <span className="text-small">{p?.name}</span>
                    <span className="text-tiny text-default-400">
                      {p?.address}
                    </span>
                  </div>
                </div>
              </SelectItem>
            )}
          </Select>
          <Input
            onWheel={(e) => e.currentTarget.blur()}
            type="number"
            name="noOfGuests"
            label="No of Guests"
            labelPlacement="outside"
            placeholder="Enter Number of Guests"
            color="default"
            isRequired={true}
            value={noOfGuests}
            onValueChange={setNoOfGuests}
            radius="md"
            size="lg"
            variant="bordered"
          />
          <Select
            name="roomCategroy"
            color="default"
            label="Room Category"
            labelPlacement="outside"
            placeholder="Select Room Category"
            selectedKeys={roomCategory}
            onSelectionChange={setRoomCategory}
            radius="md"
            size="lg"
            variant="bordered"
          >
            {RoomCategoryEnum.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </Select>
          <Select
            name="roomType"
            color="default"
            label="Room Type"
            labelPlacement="outside"
            placeholder="Select Room Type"
            selectedKeys={roomType}
            onSelectionChange={setRoomType}
            radius="md"
            size="lg"
            variant="bordered"
          >
            {RoomTypeEnum.map((roomType) => (
              <SelectItem key={roomType} value={roomType}>
                {roomType}
              </SelectItem>
            ))}
          </Select>
          <Select
            name="bookingStatus"
            color="default"
            label="Booking Status"
            labelPlacement="outside"
            placeholder="Select Booking Status"
            selectedKeys={bookingStatus}
            onSelectionChange={setBookingStatus}
            radius="md"
            size="lg"
            variant="bordered"
          >
            {BookingStatusEnum.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </Select>
          <div className="flex flex-col justify-start items-start gap-2.5 *:w-full">
            <Label className="font-normal">
              Check In Month
              <span className="text-muted-foreground text-tiny font-medium text-zinc-500 ml-2">
                (Full Months only) & (Max 6 months)
              </span>
            </Label>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="bordered"
                  className={cn(
                    "justify-start text-left font-normal py-3 h-auto",
                    !checkInMonth && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                  {checkInMonth && checkInMonth.from && checkInMonth.to ? (
                    <>
                      {format(checkInMonth?.from, "LLL dd, y")} -
                      {format(checkInMonth?.to, "LLL dd, y")}
                    </>
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={checkInMonth?.from}
                  selected={checkInMonth}
                  onSelect={(range?: DateRange) =>
                    handleSelectCheckInMonth(range as DateRange)
                  }
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            {checkInData?.months > 0 && (
              <p className="w-full text-right text-muted-foreground text-tiny font-medium text-zinc-500">
                {checkInData?.months}{" "}
                {checkInData?.months === 1 ? "month" : "months"}
              </p>
            )}
          </div>

          <Select
            name="paymentStatus"
            color="default"
            label="Payment Status"
            labelPlacement="outside"
            placeholder="Select Payment Status"
            selectedKeys={paymentStatus}
            onSelectionChange={setPaymentStatus}
            radius="md"
            size="lg"
            variant="bordered"
          >
            {PaymentStatusEnum.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>
      {Array.from(paymentStatus).join("") === PaymentStatusEnum[0] && (
        <div className="relative">
          <div className="mt-5 p-5 bg-zinc-50 border rounded-md w-full">
            <Heading variant="subheading">Payment Details</Heading>
            <div className="mt-5 grid grid-cols-3 gap-5 w-full">
              <Select
                name="paymentMethod"
                color="default"
                label="Payment Method"
                labelPlacement="outside"
                placeholder="Select Payment Method"
                selectedKeys={paymentMethod}
                onSelectionChange={setPaymentMethod}
                radius="md"
                size="lg"
                variant="bordered"
              >
                {PaymentMethodEnum.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </Select>
              <Input
                onWheel={(e) => e.currentTarget.blur()}
                type="number"
                name="paymentAmount"
                label="Payment Amount"
                labelPlacement="outside"
                placeholder="₹ 0.00"
                color="default"
                isRequired={true}
                value={paymentAmount}
                onValueChange={setPaymentAmount}
                isDisabled={
                  Array.from(bookingType).toString() === PaymentStatusEnum[1]
                }
                radius="md"
                size="lg"
                variant="bordered"
              />
            </div>
          </div>
        </div>
      )}
      <div className="mt-5 p-5 bg-zinc-50 border rounded-md w-full">
        <Heading variant="subheading">Guest Details</Heading>
        <div className="md:mt-10 lg:mt-5 grid md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
          <Input
            type="text"
            name="primaryGuestName"
            label="Primary Guest Name"
            labelPlacement="outside"
            placeholder="Enter Primary Guest Name"
            color="default"
            isRequired={true}
            value={primaryGuestName}
            onValueChange={setPrimaryGuestName}
            radius="md"
            size="lg"
            variant="bordered"
            className="w-full"
          />
          <Input
            onWheel={(e) => e.currentTarget.blur()}
            type="number"
            name="guestPhoneNumber"
            label="Guest Phone Number"
            labelPlacement="outside"
            placeholder="Enter Guest Phone Number"
            color="default"
            isRequired={true}
            value={guestPhoneNumber}
            onValueChange={setGuestPhoneNumber}
            radius="md"
            size="lg"
            variant="bordered"
            className="w-full"
          />
          <Input
            type="email"
            name="guestEmail"
            label="Guest Email"
            labelPlacement="outside"
            placeholder="Enter Guest Email"
            color="default"
            isRequired={true}
            value={guestEmail}
            onValueChange={setGuestEmail}
            radius="md"
            size="lg"
            variant="bordered"
            className="w-full"
          />
          <div className="col-span-3 flex justify-end items-center py-5">
            <ShadcnButton
              onClick={handleSubmit}
              isLoading={isLoading}
              className="px-5 rounded-lg active:scale-95"
            >
              Create Booking
            </ShadcnButton>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default AddBooking;
