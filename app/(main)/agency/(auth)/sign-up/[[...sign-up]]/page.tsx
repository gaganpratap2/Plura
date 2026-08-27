import React from 'react'
import { SignUp } from '@clerk/nextjs'

const Page = () => {
  return (
    <div className="min-h-screen w-full flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-12 flex-col justify-between overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-white">
            <div className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center font-bold">
              C
            </div>
            <span className="text-xl font-semibold">CRM Pro</span>
          </div>
        </div>

        <div className="relative z-10 space-y-4 text-white">
          <h1 className="text-4xl font-bold leading-tight">
            Manage every customer relationship in one place.
          </h1>
          <p className="text-indigo-100 text-lg max-w-md">
            Pipelines, contacts, and deals — organized, automated, and always
            up to date.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-6 text-indigo-100 text-sm">
          <span>✓ No credit card required</span>
          <span>✓ 14-day free trial</span>
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:hidden">
            <div className="w-10 h-10 mx-auto rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
              C
            </div>
          </div>

          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Create your account
            </h2>
            <p className="text-gray-500 mt-1">
              Start managing your customers today
            </p>
          </div>

          <SignUp
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'shadow-xl rounded-2xl border border-gray-100 p-6',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                socialButtonsBlockButton:
                  'border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors',
                dividerLine: 'bg-gray-200',
                dividerText: 'text-gray-400 text-xs',
                formFieldLabel: 'text-gray-700 font-medium',
                formFieldInput:
                  'rounded-lg border-gray-200 focus:border-indigo-500 focus:ring-indigo-500',
                formButtonPrimary:
                  'bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-medium normal-case transition-colors',
                footerActionLink: 'text-indigo-600 hover:text-indigo-700',
                identityPreviewEditButton: 'text-indigo-600',
              },
              variables: {
                colorPrimary: '#4f46e5',
                borderRadius: '0.5rem',
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default Page



















// import React from 'react'
// import { SignUp} from '@clerk/nextjs'

// const page = () => {
//   return (
//     <div>
//         <SignUp />
//     </div>
//   )
// }

// export default page