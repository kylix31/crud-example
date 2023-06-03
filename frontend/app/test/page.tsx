"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import SupplierForm from "@/components/supplies-form"

const SHEET_POSITIONS = ["top", "right", "bottom", "left"] as const

type SheetPosition = (typeof SHEET_POSITIONS)[number]

export default function SheetPosition() {
  const [position, setPosition] = useState<SheetPosition>("right")

  const [openSheet, setOpenSheet] = useState(false)
  return (
    <div className="flex flex-col space-y-8">
      <Button onClick={() => setOpenSheet(true)}>Open right sheet</Button>
      <Sheet open={openSheet} onOpenChange={(bool) => setOpenSheet(bool)}>
        {/* <SheetTrigger asChild> */}
        {/*   <Button>Open right sheet</Button> */}
        {/* </SheetTrigger> */}
        <SheetContent position="right" size="content">
          <SheetHeader>
            <SheetTitle>Add supplier</SheetTitle>
            <SheetDescription>
              Add a new supplier. Click on submit to save.
            </SheetDescription>
          </SheetHeader>
          <SupplierForm />
          {/* <SheetFooter> */}
          {/*   <SheetClose asChild> */}
          {/*     <Button type="submit">Save changes</Button> */}
          {/*   </SheetClose> */}
          {/* </SheetFooter> */}
        </SheetContent>
      </Sheet>
    </div>
  )
}
