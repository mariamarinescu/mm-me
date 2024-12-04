import { zodResolver } from '@hookform/resolvers/zod';
import { SimpleButton } from 'components/buttons';
import { TextArea } from 'components/inputs';
import { Input } from 'components/inputs/Input';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useSendEmail } from './useSendEmail';

const FormSchema = z.object({
  name: z.string().trim().min(3, 'Name must not be lesser than 3 characters'),
  email: z.string().email('Invalid email. Email must be a valid email address'),
  message: z
    .string()
    .trim()
    .min(50, { message: 'Message must be at least 50 characters long.' })
    .max(2300, { message: 'Message must not exceed 2300 characters.' })
    .refine((value) => /^[a-zA-Z0-9\s.,'"\-!?]*$/.test(value), {
      message: 'Message contains invalid characters.',
    }),
});

const defaultFormValues = {
  name: undefined,
  email: undefined,
  message: undefined,
};

type FormInputType = z.infer<typeof FormSchema>;

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { isValid, errors, defaultValues },
  } = useForm<FormInputType>({
    resolver: zodResolver(FormSchema),
    defaultValues: defaultFormValues,
    mode: 'onChange',
  });
  const sendEmail = useSendEmail();

  const onSubmit: SubmitHandler<FormInputType> = async (data) => {
    console.log({
      isValid,
      errors,
      defaultValues,
      data: data.name === '',
    });
    try {
      return sendEmail({
        from_name: data.name,
        from_email: data.email,
        message: data.message,
      });
      // console.log({ response });
      // reset();
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  return (
    <div className="flex h-full w-[75vw] flex-col bg-transparent md:w-[400px]">
      <div className="flex w-full items-center justify-center">
        <h3 className="text-gray-500 dark:text-gray-100">Contact me</h3>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex h-full w-full flex-col justify-start gap-3 pt-3"
      >
        <div className="flex min-h-[400px] w-full flex-col gap-0.5 pb-4 pt-2">
          <Input
            {...register('name')}
            label="First name"
            error={errors?.name?.message}
            required
          />
          <Input
            {...register('email')}
            label="E-mail address"
            error={errors?.email?.message}
            required
          />
          <TextArea
            {...register('message')}
            rows={10}
            maxLength={2300}
            aria-describedby="char-counter"
            label="Message"
            error={errors?.message?.message}
            required
          />
        </div>

        <div className="flex h-fit flex-col">
          <SimpleButton
            type="submit"
            onClick={(values: any) => {
              return onSubmit(values);
            }}
            disabled={!isValid}
          >
            <p className="text-base">Submit</p>
          </SimpleButton>
        </div>
      </form>
    </div>
  );
}
