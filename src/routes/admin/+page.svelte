<script lang="ts">
    import Button from "components/Button.svelte";
    import { deleteUser } from "./actions/deleteUser.remote";
    import { updateUser } from "./actions/updateUser.remote";
    import { invalidateAll } from "$app/navigation";
    import { getPronouns, getUserImage } from "lib/user";

    const { data } = $props();
    const users = $derived(data.users);
</script>

<main>
    <h1>Admin panel</h1>

    <form>
        <h2>Service settings</h2>
    </form>

    <h2>User List</h2>
    <ul>
        {#each users as user}
            {@const modifyUser = updateUser.for(user.id)}
            {@const { id, allowSetupOverride, allowSignupOverride, allowVotingOverride, displayName } =
                modifyUser.fields}
            <li data-hasFinishedSetup={user.hasFinishedSetup}>
                <h2>{user.displayName}</h2>
                <form
                    {...modifyUser.enhance(async ({ submit }) => {
                        try {
                            await submit();

                            alert("User updated successfully");
                        } catch (error) {
                            console.error("Error updating user:", error);
                            alert("Failed to update user");
                        }
                    })}
                >
                    <input {...id.as("hidden", user.id)} />

                    <!-- Details -->
                    <!-- <label>
                        DisplayName:
                        <input {...displayName.as("text")} value={user.displayName} />
                    </label> -->

                    <span>
                        Pronouns: {getPronouns(user)}
                    </span>

                    <span>
                        {#if user.uploadedAt}
                            Avatar: {new Date(user.uploadedAt).toLocaleString()} (<a
                                href={getUserImage(user)}
                                target="_blank"
                                rel="noopener noreferrer">View Avatar</a
                            >)
                        {:else}
                            Avatar: Never Updated
                        {/if}
                    </span>

                    <!-- Overrides -->
                    <h3>Overrides</h3>
                    <label>
                        Allow edit:
                        <input {...allowSetupOverride.as("checkbox")} checked={user.allowSetupOverride} />
                    </label>

                    <label>
                        Allow signup:
                        <input {...allowSignupOverride.as("checkbox")} checked={user.allowSignupOverride} />
                    </label>

                    <label>
                        Allow voting:
                        <input {...allowVotingOverride.as("checkbox")} checked={user.allowVotingOverride} />
                    </label>

                    <fieldset>
                        <Button type="submit" variant="primary" color="var(--theme-accent)">Update</Button>
                        <Button
                            type="button"
                            variant="primary"
                            color="var(--theme-danger)"
                            onclick={async () => {
                                if (
                                    confirm(
                                        `Are you sure you want to delete user ${user.displayName}? This action cannot be undone.`,
                                    )
                                ) {
                                    await deleteUser(user.id);
                                    await invalidateAll();
                                }
                            }}
                        >
                            Delete
                        </Button>
                    </fieldset>
                </form>
            </li>
        {/each}
    </ul>
</main>

<style lang="scss">
    ul {
        list-style: none;
        padding: 0;
    }

    li {
        margin-bottom: 1rem;
        padding: 1rem;
        border: 1px solid #ccc;
        border-radius: 4px;

        border-left: 5px solid var(--vote-pass);
        &[data-hasFinishedSetup="true"] {
            border-left-color: var(--vote-smash);
        }
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
</style>
