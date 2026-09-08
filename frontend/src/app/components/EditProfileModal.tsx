import { Camera, Mail, Pencil, User, X } from "lucide-react";
import {
  AuthResponse,
  ProfileEditForm,
  User as UserType,
} from "../types/types";
import { SetStateAction, useEffect, useState } from "react";
import { imageUploadService } from "../utils/uploadImageService";
import { errorEmitter, successEmitter } from "../utils/emitter";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import ButtonLoader from "./ButtonLoader";
import { baseURL } from "../utils/baseURL";
import { setUser } from "../redux/slices/authSlice";
interface EditProfileProps {
  user: UserType;
  openProfileModal: boolean;
  setOpenProfileModal: React.Dispatch<SetStateAction<boolean>>;
}
function EditProfileModal({
  user,
  openProfileModal,
  setOpenProfileModal,
}: EditProfileProps) {
  const toasterTheme = useAppSelector((state) => state.theme.toastTheme);

  const dispatch = useAppDispatch();

  const [form, setForm] = useState<ProfileEditForm>({
    name: user.name,
    email: user.email,
    avatar: user.avatar,
  });

  const [payLoad, setPayLoad] = useState<any | ProfileEditForm>({});

  const [file, setFile] = useState<File | Blob | null | undefined>();

  const onChangeFunc = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [imgUploading, setImgUploading] = useState<boolean>(false);

  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  const editProfile = async () => {
    try {
      setBtnLoading(true);
      // console.log("Sending payload : ", payLoad);
      if (!payLoad.name && !payLoad.email && !payLoad.avatar) {
        errorEmitter("Nothing to update", toasterTheme);
        return;
      }
      const response = await fetch(`${baseURL}/api/auth/updateprofile`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payLoad),
      });
      const editData: AuthResponse = await response.json();
      // console.log(editData);
      if (editData.success) {
        dispatch(setUser(editData.user));
        //successEmitter(editData.message, toasterTheme);
        setOpenProfileModal(!openProfileModal);
      } else errorEmitter(editData.message, toasterTheme);
    } catch (error) {
      console.error(error);
    } finally {
      setBtnLoading(false);
    }
  };

  useEffect(() => {
    const createPayLoad = () => {
      const newPayLoad: ProfileEditForm | any = {};
      if (form.name !== user.name) {
        newPayLoad.name = form.name.trim();
      }
      if (form.email !== user.email) {
        newPayLoad.email = form.email.trim();
      }
      if (form.avatar !== user.avatar) {
        newPayLoad.avatar = form.avatar;
      }
      setPayLoad(newPayLoad);
    };
    createPayLoad();
  }, [form.name, form.email, form.avatar]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <Pencil className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Edit profile
              </h2>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Update your profile information.
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close modal"
            onClick={() => setOpenProfileModal(!openProfileModal)}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            // console.log("Submitted..");
            await editProfile();
          }}
        >
          <div className="space-y-5 px-6 py-6">
            {/* Profile Picture */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-800 dark:text-slate-200">
                Profile picture
              </label>

              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <img
                    src={
                      form.avatar ??
                      `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80`
                    }
                    alt="Profile picture"
                    className="h-16 w-16 rounded-full border border-slate-200 object-cover dark:border-slate-700"
                  />

                  <button
                    type="button"
                    aria-label="Change profile picture"
                    className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white shadow-sm transition-colors hover:bg-indigo-700"
                  >
                    <Camera className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div>
                  <button
                    type="button"
                    disabled={imgUploading || btnLoading}
                    onClick={async (e) => {
                      e.preventDefault();
                      if (!file) {
                        errorEmitter(
                          "Choose a file to upload first",
                          toasterTheme,
                        );
                        return;
                      }
                      setImgUploading(true);
                      const result = await imageUploadService(file!);
                      setImgUploading(false);
                      if (result)
                        setForm({ ...form, avatar: result as string });
                    }}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    {imgUploading ? (
                      <ButtonLoader buttonMessage="Uploading image..." />
                    ) : (
                      "Upload image"
                    )}
                  </button>

                  <p className="mt-1.5 text-[11px] text-slate-400 dark:text-slate-500">
                    JPG, PNG or WEBP. Max 5MB.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <label
                htmlFor="profile-image"
                className="cursor-pointer rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Choose image
              </label>

              <div className="relative">
                <input
                  id="profile-image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0];

                    if (selectedFile) {
                      setFile(selectedFile);
                    }
                  }}
                />
              </div>
            </div>
            {/* Name */}
            <div>
              <label
                htmlFor="profile-name"
                className="mb-2 block text-sm font-medium text-slate-800 dark:text-slate-200"
              >
                Full name
              </label>

              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  id="profile-name"
                  name="name"
                  onChange={onChangeFunc}
                  value={form.name}
                  type="text"
                  defaultValue="Vishal Tiwari"
                  placeholder={user.name ?? "Enter your name"}
                  className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="profile-email"
                className="mb-2 block text-sm font-medium text-slate-800 dark:text-slate-200"
              >
                Email address
              </label>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  id="profile-email"
                  type="email"
                  name="email"
                  onChange={onChangeFunc}
                  value={form.email}
                  defaultValue="vishal@example.com"
                  placeholder={user.email ?? "Enter your email"}
                  className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                />
              </div>

              <p className="mt-1.5 text-[11px] text-slate-400 dark:text-slate-500">
                You may need to verify your new email address.
              </p>
            </div>

            {/* Profile picture */}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4 dark:border-slate-800">
            <button
              disabled={btnLoading || imgUploading}
              type="reset"
              onClick={() => setOpenProfileModal(!openProfileModal)}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={btnLoading || imgUploading}
              className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            >
              {btnLoading ? (
                <ButtonLoader buttonMessage="Saving Changes..." />
              ) : (
                "Save changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfileModal;
