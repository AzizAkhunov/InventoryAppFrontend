import { Input } from "@/components/ui/input"

type Props = {
  inventory: any
  setInventory: (inv: any) => void
}

export default function FieldsTab({ inventory, setInventory }: Props) {

function updateField(field: string, value: any) {

setInventory({
...inventory,
[field]: value
})

}

return (

<div className="flex flex-col gap-6">

<h2 className="text-lg font-semibold">
Item Fields
</h2>


{/* STRING FIELDS */}

<div className="flex flex-col gap-3">

<h3 className="font-medium text-sm text-muted-foreground">
String Fields
</h3>

<div className="flex items-center gap-3">

<input
type="checkbox"
checked={inventory.customString1Enabled}
onChange={(e) =>
updateField("customString1Enabled", e.target.checked)
}
/>

<Input
placeholder="Field name"
value={inventory.customString1Name || ""}
onChange={(e) =>
updateField("customString1Name", e.target.value)
}
/>

</div>


<div className="flex items-center gap-3">

<input
type="checkbox"
checked={inventory.customString2Enabled}
onChange={(e) =>
updateField("customString2Enabled", e.target.checked)
}
/>

<Input
placeholder="Field name"
value={inventory.customString2Name || ""}
onChange={(e) =>
updateField("customString2Name", e.target.value)
}
/>

</div>


<div className="flex items-center gap-3">

<input
type="checkbox"
checked={inventory.customString3Enabled}
onChange={(e) =>
updateField("customString3Enabled", e.target.checked)
}
/>

<Input
placeholder="Field name"
value={inventory.customString3Name || ""}
onChange={(e) =>
updateField("customString3Name", e.target.value)
}
/>

</div>

</div>


{/* NUMBER FIELDS */}

<div className="flex flex-col gap-3">

<h3 className="font-medium text-sm text-muted-foreground">
Number Fields
</h3>

<div className="flex items-center gap-3">

<input
type="checkbox"
checked={inventory.customNumber1Enabled}
onChange={(e) =>
updateField("customNumber1Enabled", e.target.checked)
}
/>

<Input
placeholder="Field name"
value={inventory.customNumber1Name || ""}
onChange={(e) =>
updateField("customNumber1Name", e.target.value)
}
/>

</div>

<div className="flex items-center gap-3">

<input
type="checkbox"
checked={inventory.customNumber2Enabled}
onChange={(e) =>
updateField("customNumber2Enabled", e.target.checked)
}
/>

<Input
placeholder="Field name"
value={inventory.customNumber2Name || ""}
onChange={(e) =>
updateField("customNumber2Name", e.target.value)
}
/>

</div>

<div className="flex items-center gap-3">

<input
type="checkbox"
checked={inventory.customNumber3Enabled}
onChange={(e) =>
updateField("customNumber3Enabled", e.target.checked)
}
/>

<Input
placeholder="Field name"
value={inventory.customNumber3Name || ""}
onChange={(e) =>
updateField("customNumber3Name", e.target.value)
}
/>

</div>

</div>


{/* BOOLEAN FIELDS */}

<div className="flex flex-col gap-3">

<h3 className="font-medium text-sm text-muted-foreground">
Boolean Fields
</h3>

<div className="flex items-center gap-3">

<input
type="checkbox"
checked={inventory.customBool1Enabled}
onChange={(e) =>
updateField("customBool1Enabled", e.target.checked)
}
/>

<Input
placeholder="Field name"
value={inventory.customBool1Name || ""}
onChange={(e) =>
updateField("customBool1Name", e.target.value)
}
/>

</div>

<div className="flex items-center gap-3">

<input
type="checkbox"
checked={inventory.customBool2Enabled}
onChange={(e) =>
updateField("customBool2Enabled", e.target.checked)
}
/>

<Input
placeholder="Field name"
value={inventory.customBool2Name || ""}
onChange={(e) =>
updateField("customBool2Name", e.target.value)
}
/>

</div>

<div className="flex items-center gap-3">

<input
type="checkbox"
checked={inventory.customBool3Enabled}
onChange={(e) =>
updateField("customBool3Enabled", e.target.checked)
}
/>

<Input
placeholder="Field name"
value={inventory.customBool3Name || ""}
onChange={(e) =>
updateField("customBool3Name", e.target.value)
}
/>

</div>

</div>

</div>

)

}