import { redirect } from "next/navigation"

type Props = {
  params: { photoId: string }
}

export default function PhotoRedirectPage({ params }: Props) {
  const { photoId } = params
  redirect(`/?photoId=${encodeURIComponent(photoId)}`)
}
