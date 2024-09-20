"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea" 

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  message: z.string().min(5, {
    message: "Message must be at least 5 characters.",
  }),
})

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Email sent successfully");
      } else {
        alert("Error sending email");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send email.");
    }

    setIsSubmitting(false);
  }

  return (
    <div className="flex justify-center mt-5 md:mt-12 lg:mt-[100px]">
      <div className="px-2 md:px-8 lg:px-12 flex flex-col align-middle w-[80%] md:w-[60%]">
        <h1 className="text-xl md:text-xl lg:text-2xl font-bold text-center text-gray-800 mb-12">
          Contact us!
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Name" {...field} className="w-full" />
                  </FormControl>
                  <FormDescription>
                    Enter your email address.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Type your message here" {...field} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Sending..." : "Submit"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default Contact
