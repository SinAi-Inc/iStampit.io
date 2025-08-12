from istampit_cli.__main__ import build_parser


def test_help_contains_commands():
    parser = build_parser()
    help_text = parser.format_help()
    for cmd in ["stamp", "verify", "upgrade", "info", "upgrade-all"]:
        assert cmd in help_text
