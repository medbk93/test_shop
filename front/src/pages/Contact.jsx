import { useEffect, useState } from 'react';
import {
  Input,
  Box,
  Heading,
  Center,
  Field,
  Button,
  Stack,
  Textarea,
  Alert,
  Span,
  CloseButton,
} from '@chakra-ui/react';
import { useForm as useFormspree } from '@formspree/react';
import { useForm } from 'react-hook-form';

const Contact = () => {
  const MAX_CHARACTERS = 300;
  const FORM_ID = 'xovpaonj';
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [state, submitForm] = useFormspree(FORM_ID);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (state.succeeded) {
      setShowSuccess(true);
    }
  }, [state.succeeded]);

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    submitForm(data);
    reset();
  });

  return (
    <Box
      borderWidth="1px"
      borderColor="border.disabled"
      color="fg.disabled"
      my={8}
      mx={50}
      p={4}
    >
      <Center flexDirection="column" gap={4}>
        <Heading mb={4}>Contact Us</Heading>
        {showSuccess && (
          <Alert.Root
            status="success"
            width={'50%'}
            justifyContent={'space-between'}
          >
            <Box display={'flex'} gap={2}>
              <Alert.Indicator />
              <Alert.Title>
                Your message has been send successfully !
              </Alert.Title>
            </Box>
            <CloseButton
              pos="relative"
              top="-2"
              insetEnd="-2"
              onClick={() => setShowSuccess(false)}
            />
          </Alert.Root>
        )}
      </Center>
      <form onSubmit={onSubmit}>
        <Stack gap="4" py={10} maxW="600px" mx="auto">
          <Field.Root invalid={!!errors.email}>
            <Field.Label>Email</Field.Label>
            <Input
              type="email"
              placeholder="@email"
              {...register('email', {
                required: 'email is required',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: 'Invalid email address',
                },
              })}
            />
            <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.message}>
            <Field.Label>Message</Field.Label>
            <Textarea
              autoresize
              placeholder="Write your message here..."
              {...register('message', {
                required: 'Message is required',
                maxLength: {
                  value: MAX_CHARACTERS,
                  message: `Max ${MAX_CHARACTERS} characters allowed`,
                },
              })}
            />
            <Field.ErrorText>{errors.message?.message}</Field.ErrorText>
          </Field.Root>
          <Button type="submit" disabled={state.submitting}>
            Submit
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default Contact;
