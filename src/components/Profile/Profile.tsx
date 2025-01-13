"use client";
import React, { useState, useEffect } from 'react';
import { IoArrowBack } from "react-icons/io5";
import { useSession, signIn } from 'next-auth/react';
import { AuthResponse } from '@/types/types';
import { Avatar, Button, Input } from '@nextui-org/react';
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { MdEdit } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { toast } from "sonner";
import { changePassword, updateProfile } from '@/services/user'; // Assuming you have these services

// Schema for form validation
const profileSchema = z.object({
  name: z.string().min(3, { message: "name must be at least 3 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, { message: "Current password is required" }),
  newPassword: z.string().min(6, { message: "New password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Confirm password is required" }),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type ProfileFields = z.infer<typeof profileSchema>;
type PasswordFields = z.infer<typeof passwordSchema>;

const Profile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const { data: sessionData, status ,update} = useSession();
  const session = sessionData as unknown as AuthResponse;

  // Toggle visibility for password fields
  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const toggleCurrentPasswordVisibility = () => setIsCurrentPasswordVisible(!isCurrentPasswordVisible);
  const toggleNewPasswordVisibility = () => setIsNewPasswordVisible(!isNewPasswordVisible);
  const toggleConfirmPasswordVisibility = () => setIsConfirmPasswordVisible(!isConfirmPasswordVisible);

  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn();
    }
  }, [status]);

  const { register: registerProfile, handleSubmit: handleSubmitProfile, formState: { errors: profileErrors } } = useForm<ProfileFields>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
    },
  });

  const { register: registerPassword, handleSubmit: handleSubmitPassword, formState: { errors: passwordErrors }, watch } = useForm<PasswordFields>({
    resolver: zodResolver(passwordSchema),
  });

  // Mutation for changing password
  const { mutate: mutatePassword, isPending: isPasswordPending } = useMutation({
    mutationFn: (data: PasswordFields) => changePassword(session?.user?.id || "", data),
    onSuccess: () => {
      toast.success("Password changed successfully.");
      setIsChangePassword(false);
    },
    onError: (error: any) => {
      const message = error.response?.data?.error?.message || "An error occurred while changing the password.";
      toast.error(message);
    },
  });

  // Mutation for updating profile
  const { mutate: mutateProfile, isPending: isProfilePending } = useMutation({
    mutationFn: (data: Partial<ProfileFields>) => updateProfile(session?.user?.id || "", data),
    onSuccess: async (updatedData) => {
      toast.success("Profile updated successfully.");
      setIsEdit(false);
      
    },
    onError: (error: any) => {
      const message = error.response?.data?.error?.message || "An error occurred while updating the profile.";
      toast.error(message);
    },
  });

  const onSubmitProfile: SubmitHandler<ProfileFields> = (data) => {
    const updatedFields: Partial<ProfileFields> = {};

    // Check if the name has been changed
   
      updatedFields.name = data.name;
   

    // Check if the email has been changed
      updatedFields.email = data.email;


    // Only call the mutation if there are changes
    if (Object.keys(updatedFields).length > 0) {
      mutateProfile(updatedFields);
    } else {
      toast.info("No changes were made.");
    }
  };

  const onSubmitPassword: SubmitHandler<PasswordFields> = (data) => {
    mutatePassword(data);
  };

  return (
    <div className="w-full px-20 pt-10 h-[70vh]">
      <div className='flex gap-14'>
        <IoArrowBack size={35} className="cursor-pointer" />
        <h1 className='text-3xl font-semibold'>My Profile</h1>
      </div>
      <div className='flex gap-32'>
        <div className='flex flex-col gap-14 items-center mt-9 px-8 py-6 w-1/4'>
          <Avatar
            className='w-24 h-24'
            color='warning'
            as="button"
            src={`https://ui-avatars.com/api/?name=${session?.user?.name}&background=E4C087&color=ffff`}
          />
          <div className='flex flex-col gap-3 items-center'>
            <Button variant='light' className='text-white rounded-xl w-40 bg-primary hover:bg-primary' onClick={() => { setIsEdit(!isEdit); setIsChangePassword(false); }}>
              {isEdit ? "View Profile" : "Edit Profile"}
            </Button>
            <Button variant='light' className='text-primary rounded-xl w-40 border border-primary bg-white' onClick={() => setIsChangePassword(true)}>
              Change Password
            </Button>
          </div>
        </div>
        <div className='flex flex-col gap-10 m-20 w-[26rem]'>
          {isChangePassword ? (
            <div>
              <div className='flex gap-4 items-center'>
                <MdEdit size={27} />
                <h1 className='text-xl font-semibold'>Change Password</h1>
              </div>
              <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="flex flex-col gap-6 mt-5">
                {/* Current Password Field */}
                <div className="flex w-96 py-1 px-3 flex-wrap md:flex-nowrap gap-4 ">
                  <Input
                    isRequired
                    label="Current Password"
                    labelPlacement="outside"
                    placeholder="Enter current password"
                    isInvalid={!!passwordErrors.currentPassword}
                    errorMessage={passwordErrors.currentPassword?.message}
                    endContent={
                      <button className="focus:outline-none" type="button" onClick={toggleCurrentPasswordVisibility}>
                        {isCurrentPasswordVisible ? (
                          <LuEyeOff size={22} className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <LuEye size={22} className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                    type={isCurrentPasswordVisible ? "text" : "password"}
                    variant="bordered"
                    size="md"
                    radius="sm"
                    {...registerPassword("currentPassword")}
                  />
                </div>

                {/* New Password Field */}
                <div className="flex w-96 py-1 px-3 flex-wrap md:flex-nowrap gap-4">
                  <Input
                    isRequired
                    label="New Password"
                    labelPlacement="outside"
                    placeholder="Enter new password"
                    isInvalid={!!passwordErrors.newPassword}
                    errorMessage={passwordErrors.newPassword?.message}
                    endContent={
                      <button className="focus:outline-none" type="button" onClick={toggleNewPasswordVisibility}>
                        {isNewPasswordVisible ? (
                          <LuEyeOff size={22} className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <LuEye size={22} className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                    type={isNewPasswordVisible ? "text" : "password"}
                    variant="bordered"
                    size="md"
                    radius="sm"
                    {...registerPassword("newPassword")}
                  />
                </div>

                {/* Confirm Password Field */}
                <div className="flex w-96 py-1 px-3 flex-wrap md:flex-nowrap gap-4">
                  <Input
                    isRequired
                    label="Confirm Password"
                    labelPlacement="outside"
                    placeholder="Confirm new password"
                    isInvalid={!!passwordErrors.confirmPassword}
                    errorMessage={passwordErrors.confirmPassword?.message}
                    endContent={
                      <button className="focus:outline-none" type="button" onClick={toggleConfirmPasswordVisibility}>
                        {isConfirmPasswordVisible ? (
                          <LuEyeOff size={22} className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <LuEye size={22} className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                    type={isConfirmPasswordVisible ? "text" : "password"}
                    variant="bordered"
                    size="md"
                    radius="sm"
                    {...registerPassword("confirmPassword")}
                  />
                </div>

                <div className='flex gap-3 items-center w-[23rem] justify-between m-4'>
                  <Button variant='light' className='text-primary rounded-xl w-40 border border-primary bg-white' onClick={() => { setIsChangePassword(false); setIsEdit(false); }}>Cancel</Button>
                  <Button type='submit' variant='light' className='text-white rounded-xl w-40 bg-primary hover:bg-primary' disabled={isPasswordPending}>
                    {isPasswordPending ? "Changing..." : "Change Password"}
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div>
              {isEdit ? (
                <div className='flex gap-4 items-center'>
                  <MdEdit size={27} />
                  <h1 className='text-xl font-semibold'>Edit Information</h1>
                </div>
              ) : (
                <div className='flex gap-4 items-center'>
                  <FaUser size={20} />
                  <h1 className='text-xl font-semibold'>Personal Information</h1>
                </div>
              )}
              {isEdit ? (
                <form onSubmit={handleSubmitProfile(onSubmitProfile)} className='flex flex-col gap-6 mt-5 '>
                  <div className="flex w-96 py-1 px-3 flex-wrap md:flex-nowrap gap-4">
                    <Input
                      variant='bordered'
                      label="name"
                      labelPlacement='outside'
                      placeholder="Enter name"
                      isInvalid={!!profileErrors.name}
                      errorMessage={profileErrors.name?.message}
                      {...registerProfile("name")}
                    />
                  </div>
                  <div className="flex w-96 py-1 px-3 flex-wrap md:flex-nowrap gap-4">
                    <Input
                      variant='bordered'
                      label="Email"
                      labelPlacement='outside'
                      placeholder="Enter email"
                      isInvalid={!!profileErrors.email}
                      errorMessage={profileErrors.email?.message}
                      {...registerProfile("email")}
                    />
                  </div>
                  <div className='flex gap-3 items-center w-[23rem] justify-between m-4'>
                    <Button variant='light' className='text-primary rounded-xl w-40 border border-primary bg-white' onClick={() => setIsEdit(false)}>Cancel Edit</Button>
                    <Button type='submit' variant='light' className='text-white rounded-xl w-40 bg-primary hover:bg-primary' disabled={isProfilePending}>
                      {isProfilePending ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className='flex flex-col gap-6 mt-5'>
                  <div className="flex w-96 py-1 px-3 flex-wrap md:flex-nowrap gap-4 ">
                    <Input disabled variant='bordered' label="name" labelPlacement='outside' placeholder={session?.user?.name}  />
                  </div>
                  <div className="flex w-96 py-1 px-3 flex-wrap md:flex-nowrap gap-4">
                    <Input disabled variant='bordered' label="Email" labelPlacement='outside' placeholder={session?.user?.email}  />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;