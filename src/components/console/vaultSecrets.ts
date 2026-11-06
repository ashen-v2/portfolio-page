const base = import.meta.env.BASE_URL;

export type VaultSecret = {
  id: "instagram" | "cat" | "secret";
  label: string;
  href?: string;
  image?: string;
};

export const vaultSecrets: VaultSecret[] = [
  { id: "instagram", label: "my_instagram", href: "https://www.instagram.com/ashen.f__/" },
  { id: "cat", label: "my_cat", image: `${base}my_cat.jpeg` },
  {
    id: "secret",
    label: "MY_SUPER_SUPER_RARE_SECRET",
    href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
];

export function openVaultLink(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}
