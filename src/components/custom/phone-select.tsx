"use client";

import * as React from "react";
import { Phone, Search } from "lucide-react";
// @ts-expect-error - react-select-country-list doesn't have type definitions
import countryList from "react-select-country-list";
import { cn } from "@/lib/utils";
import { useCurrentLang } from "@/hooks/useCurrentLang";
import { getDirection } from "@/utils/translations/language-utils";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Country calling codes mapping (common countries)
export const COUNTRY_CALLING_CODES: Record<string, string> = {
  US: "+1",
  GB: "+44",
  CA: "+1",
  AU: "+61",
  DE: "+49",
  FR: "+33",
  IT: "+39",
  ES: "+34",
  NL: "+31",
  BE: "+32",
  CH: "+41",
  AT: "+43",
  SE: "+46",
  NO: "+47",
  DK: "+45",
  FI: "+358",
  PL: "+48",
  CZ: "+420",
  GR: "+30",
  PT: "+351",
  IE: "+353",
  NZ: "+64",
  JP: "+81",
  CN: "+86",
  IN: "+91",
  KR: "+82",
  SG: "+65",
  MY: "+60",
  TH: "+66",
  ID: "+62",
  PH: "+63",
  VN: "+84",
  AE: "+971",
  SA: "+966",
  EG: "+20",
  ZA: "+27",
  BR: "+55",
  MX: "+52",
  AR: "+54",
  CL: "+56",
  CO: "+57",
  PE: "+51",
  TR: "+90",
  IL: "+972",
  RU: "+7",
  UA: "+380",
  SY: "+963", // Syria
  // Add more as needed
};

// Function to get flag emoji from country code
const getCountryFlag = (countryCode: string): string => {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

interface PhoneSelectProps {
  value?: {
    countryCode?: string;
    phoneNumber?: string;
  };
  onChange?: (value: { countryCode: string; phoneNumber: string }) => void;
  onCountryCodeChange?: (countryCode: string) => void;
  onPhoneNumberChange?: (phoneNumber: string) => void;
  placeholder?: string;
  countryCodePlaceholder?: string;
  phoneNumberPlaceholder?: string;
  className?: string;
  disabled?: boolean;
  error?: boolean;
}

export function PhoneSelect({
  value,
  onChange,
  onCountryCodeChange,
  onPhoneNumberChange,
  placeholder,
  countryCodePlaceholder = "Country",
  phoneNumberPlaceholder = "Phone number",
  className,
  disabled = false,
  error = false,
}: PhoneSelectProps) {
  const lang = useCurrentLang();
  const direction = getDirection(lang);
  const isRTL = direction === "rtl";

  const [countryCode, setCountryCode] = React.useState<string>(
    value?.countryCode || "SY",
  );
  const [phoneNumber, setPhoneNumber] = React.useState<string>(
    value?.phoneNumber || "",
  );
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const countryOptions = React.useMemo(() => countryList().getData(), []);

  // Filter countries based on search query
  const filteredCountries = React.useMemo(() => {
    if (!searchQuery.trim()) return countryOptions;
    const query = searchQuery.toLowerCase();
    return countryOptions.filter(
      (country: { label: string; value: string }) =>
        country.label.toLowerCase().includes(query) ||
        country.value.toLowerCase().includes(query) ||
        (COUNTRY_CALLING_CODES[country.value] || "")
          .toLowerCase()
          .includes(query),
    );
  }, [countryOptions, searchQuery]);

  // Update local state when value prop changes
  React.useEffect(() => {
    if (value) {
      if (value.countryCode !== undefined) {
        setCountryCode(value.countryCode);
      }
      if (value.phoneNumber !== undefined) {
        setPhoneNumber(value.phoneNumber);
      }
    }
  }, [value]);

  const handleCountryCodeChange = React.useCallback(
    (newCountryCode: string) => {
      setCountryCode(newCountryCode);
      onCountryCodeChange?.(newCountryCode);
      onChange?.({
        countryCode: newCountryCode,
        phoneNumber,
      });
    },
    [onCountryCodeChange, onChange, phoneNumber],
  );

  const handlePhoneNumberChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newPhoneNumber = e.target.value.replace(/\D/g, "");
      setPhoneNumber(newPhoneNumber);
      onPhoneNumberChange?.(newPhoneNumber);
      onChange?.({
        countryCode,
        phoneNumber: newPhoneNumber,
      });
    },
    [onPhoneNumberChange, onChange, countryCode],
  );

  const callingCode = COUNTRY_CALLING_CODES[countryCode] || "+1";

  return (
    <div
      className={cn(
        "flex w-full gap-2",
        isRTL && "flex-row-reverse",
        className,
      )}
      dir={direction}
    >
      {/* Country Code Selector */}
      <div className="flex-shrink-0">
        <Select
          value={countryCode}
          onValueChange={(newValue) => {
            handleCountryCodeChange(newValue);
            setIsOpen(false);
            setSearchQuery("");
          }}
          disabled={disabled}
          open={isOpen}
          onOpenChange={setIsOpen}
        >
          <SelectTrigger className={cn("w-[120px]")} aria-invalid={error}>
            <SelectValue placeholder={countryCodePlaceholder}>
              <span className="flex items-center gap-1.5">
                <span className="text-base">{getCountryFlag(countryCode)}</span>
                <span className="text-xs font-medium">{callingCode}</span>
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="p-0">
            {/* Search Input */}
            <div className="bg-popover sticky top-0 z-10 border-b p-2">
              <div className="relative">
                <Search className="text-muted-foreground absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />
                <Input
                  type="text"
                  placeholder="Search country..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 pr-2 pl-8 text-sm"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            {/* Country List */}
            <div className="max-h-[300px] overflow-y-auto">
              {filteredCountries.length > 0 ? (
                filteredCountries.map(
                  (option: { label: string; value: string }) => {
                    const code = option.value;
                    const codeCallingCode = COUNTRY_CALLING_CODES[code] || "+1";
                    const isSelected = code === countryCode;
                    return (
                      <SelectItem key={code} value={code}>
                        <span className="flex items-center gap-2">
                          <span className="text-base">
                            {getCountryFlag(code)}
                          </span>
                          <span
                            className={cn(
                              "text-xs font-medium",
                              isSelected ? "text-primary" : "text-foreground",
                            )}
                          >
                            {codeCallingCode}
                          </span>
                        </span>
                      </SelectItem>
                    );
                  },
                )
              ) : (
                <div className="text-muted-foreground px-2 py-4 text-center text-sm">
                  No countries found
                </div>
              )}
            </div>
          </SelectContent>
        </Select>
      </div>

      {/* Phone Number Input */}
      <div className="flex-1">
        <Input
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          placeholder={phoneNumberPlaceholder || placeholder}
          startIcon={<Phone className="h-5 w-5" />}
          disabled={disabled}
          inputMode="numeric"
          className={cn(error && "border-destructive")}
          aria-invalid={error}
        />
      </div>
    </div>
  );
}

// Hook for use with react-hook-form
export function usePhoneSelect() {
  const [phoneValue, setPhoneValue] = React.useState<{
    countryCode: string;
    phoneNumber: string;
  }>({
    countryCode: "SY",
    phoneNumber: "",
  });

  const handleChange = React.useCallback(
    (value: { countryCode: string; phoneNumber: string }) => {
      setPhoneValue(value);
    },
    [],
  );

  const getFullPhoneNumber = React.useCallback(() => {
    const callingCode = COUNTRY_CALLING_CODES[phoneValue.countryCode] || "+1";
    return `${callingCode}${phoneValue.phoneNumber}`;
  }, [phoneValue]);

  return {
    value: phoneValue,
    onChange: handleChange,
    getFullPhoneNumber,
  };
}
