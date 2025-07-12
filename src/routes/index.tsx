import { useNavigate } from "@solidjs/router";
import { onMount } from "solid-js";



export default function Home() {
  const navigate = useNavigate();
  onMount(() => {
    navigate("/login", { replace: true });
  })
  return (
    <main />
  );
}
