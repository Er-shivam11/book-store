from utils.yaml_reader import read_yaml


def test_yaml():

    config = read_yaml("users_user.yml")

    print(config)


if __name__ == "__main__":
    test_yaml()