import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

function FormControls({ formControls = [], formData = {}, setFormData }) {
    const renderComponentByType = (getControlItem) => {
        if (!getControlItem?.name) {
            console.warn("Missing controlItem.name", getControlItem);
            return null;
        }

        const value = formData?.[getControlItem.name] ?? "";

        switch (getControlItem.componentType) {
            case "input":
                return (
                    <Input
                        id={getControlItem.name}
                        name={getControlItem.name}
                        placeholder={getControlItem.placeholder}
                        type={getControlItem.type || "text"}
                        value={value}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                [getControlItem.name]: e.target.value,
                            }))
                        }
                    />
                );

            case "select":
                return (
                    <Select
                        value={value}
                        onValueChange={(val) =>
                            setFormData((prev) => ({
                                ...prev,
                                [getControlItem.name]: val,
                            }))
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={getControlItem.label} />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.isArray(getControlItem.options) &&
                                getControlItem.options.length > 0
                                ? getControlItem.options.map((opt) => (
                                    <SelectItem key={opt.id} value={opt.id}>
                                        {opt.label}
                                    </SelectItem>
                                ))
                                : null}
                        </SelectContent>
                    </Select>
                );

            case "textarea":
                return (
                    <Textarea
                        id={getControlItem.name}
                        name={getControlItem.name}
                        placeholder={getControlItem.placeholder}
                        value={value}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                [getControlItem.name]: e.target.value,
                            }))
                        }
                    />
                );

            default:
                return (
                    <Input
                        id={getControlItem.name}
                        name={getControlItem.name}
                        placeholder={getControlItem.placeholder}
                        type={getControlItem.type || "text"}
                        value={value}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                [getControlItem.name]: e.target.value,
                            }))
                        }
                    />
                );
        }
    };

    return (
        <div className="flex flex-col gap-3">
            {Array.isArray(formControls) && formControls.length > 0 ? (
                formControls.map((controlItem, index) =>
                    controlItem?.name ? (
                        <div key={controlItem.name || index}>
                            <Label htmlFor={controlItem.name}>{controlItem.label}</Label>
                            {renderComponentByType(controlItem)}
                        </div>
                    ) : null
                )
            ) : (
                <p className="text-sm text-gray-500">No form fields provided.</p>
            )}
        </div>
    );
}

export default FormControls;
