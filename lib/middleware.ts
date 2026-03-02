// import { createServerClient } from "@supabase/ssr"
// import { NextResponse, type NextRequest } from "next/server"

// export async function middleware(request: NextRequest) {
//   let response = NextResponse.next({ request })

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         getAll() {
//           return request.cookies.getAll()
//         },
//         setAll(cookiesToSet) {
//           cookiesToSet.forEach(({ name, value, options }) =>
//             response.cookies.set(name, value, options)
//           )
//         },
//       },
//     }
//   )

//   const {
//     data: { user },
//   } = await supabase.auth.getUser()

//   const pathname = request.nextUrl.pathname

//   // 🚫 Not logged in → block dashboard
//   if (!user && pathname.startsWith("/dashboard")) {
//     return NextResponse.redirect(new URL("/login", request.url))
//   }

//   // 🔁 Logged in → block login page
//   if (user && pathname === "/login") {
//     return NextResponse.redirect(new URL("/dashboard", request.url))
//   }

//   // 🔐 ADMIN ROUTE PROTECTION
//   if (user && pathname.startsWith("/dashboard/admin")) {
//     const { data: profile } = await supabase
//       .from("profiles")
//       .select("role")
//       .eq("id", user.id)
//       .single()

//     if (!profile || profile.role !== "ADMIN") {
//       return NextResponse.redirect(new URL("/dashboard", request.url))
//     }
//   }

//   return response
// }

// export const config = {
//   matcher: ["/dashboard/:path*", "/login"],
// }