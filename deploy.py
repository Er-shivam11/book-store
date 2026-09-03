import os


ENVIRONMENTS = {
    "1": ("DEV", "siyaram_bookstore.settings"),
    "2": ("UAT", "siyaram_bookstore.settings_uat"),
    "3": ("PRD", "siyaram_bookstore.settings_prd"),
}


def main():
    print("\n========================================")
    print("       SIYARAM BOOKSTORE ENV")
    print("========================================")
    print("1. DEV")
    print("2. UAT")
    print("3. PRD")
    print("========================================")

    choice = input("Select environment [1/2/3]: ").strip()

    if choice not in ENVIRONMENTS:
        print("Invalid selection.")
        return

    environment, settings_module = ENVIRONMENTS[choice]

    if environment == "UAT":
        print("\nUAT settings are not created yet.")
        return

    os.environ["DJANGO_SETTINGS_MODULE"] = settings_module

    print("\nEnvironment selected:")
    print(f"ENV      : {environment}")
    print(f"SETTINGS : {settings_module}")
    print("\nThis setting applies to this Python process only.")


if __name__ == "__main__":
    main()