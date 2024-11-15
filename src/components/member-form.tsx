import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { memberFormSchema, TMemberForm } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useGroupContext } from "@/lib/hooks";
import { cn, setServerFieldErrors } from "@/lib/utils";
import { toast } from "sonner";

export default function MemberForm() {
  const { selectedGroupId, handleAddMember } = useGroupContext();
  const {
    register,
    trigger,
    control,
    watch,
    handleSubmit,
    formState: { isSubmitting, errors },
    getValues,
    setError,
    reset,
  } = useForm<TMemberForm>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      isRegistered: false, //since default value is set no need of default value in watch(isRegistered)
    },
  });

  //When both defaultValue(second argument in watch()) and defaultValues(of useForm) are supplied, defaultValue will be returned.
  //Watch the value of isRegistered
  const isRegistered = watch("isRegistered");

  const onSubmit = async () => {
    const result = await trigger();
    if (!result) {
      console.log("errors: ", errors);
      return;
    }
    let memberData = getValues();
    if (selectedGroupId) {
      const actionData = await handleAddMember(memberData, selectedGroupId);
      if (!actionData.isSuccess) {
        if (actionData.fieldErrors) {
          setServerFieldErrors(actionData.fieldErrors, setError);
        } else {
          toast.error(actionData.message);
        }
      } else if (actionData.isSuccess) {
        reset();
        toast.success("Member added successfully");
      }
    }
  };
  return (
    <form
      className="relative flex flex-col gap-y-5 bg-white rounded-md sm:rounded-lg px-5 py-4 border-b border-black/10 min-h-40"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <Input
          id="firstName"
          {...register("firstName")}
          placeholder="First Name"
        />
        {errors.firstName && (
          <p className="text-red-500/85">{errors.firstName.message}</p>
        )}
      </div>
      <div>
        <Input
          id="lastName"
          {...register("lastName")}
          placeholder="Last Name (optional)"
        />
        {errors.lastName && (
          <p className="text-red-500/85">{errors.lastName.message}</p>
        )}
      </div>
      <div className="flex justify-left items-center gap-x-3">
        <Label htmlFor="isRegistered" className="text-black">
          Is user registered in Split Ease?{" "}
        </Label>
        <Controller
          control={control}
          name="isRegistered"
          render={({ field }) => (
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              className="data-[state=checked]:bg-primecolor"
            />
          )}
          //render={({ field }) => <input type="text" {...field} />}
        ></Controller>
        {errors.isRegistered && (
          <p className="text-red-500/85">{errors.isRegistered.message}</p>
        )}
      </div>
      <div
        className={cn(
          "flex flex-col transform-all duration-500 ease-in-out origin-top",
          isRegistered
            ? "scale-y-100 opacity-100  max-h-40"
            : "scale-y-0 opacity-0 max-h-0"
        )}
      >
        <Input id="email" {...register("email")} placeholder="Email" />
        {errors.email && (
          <p className="text-red-500/85">{errors.email.message}</p>
        )}
      </div>

      <div className="flex justify-center items-center">
        <Button
          className="min-w-56 max-w-96 bg-opacity-85 rounded-md state-effects"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding Member..." : "Add Member to Group"}
        </Button>
      </div>
    </form>
  );
}
