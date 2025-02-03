import requests


def download_rawtext(url: str, outfile: str = None) -> str:
    """Download raw text from a URL."""
    response = requests.get(url)
    if response.status_code == 200:
        text = response.text
    else:
        print(f"Failed to download {url}. HTTP Status: {response.status_code}")
        text = None

    if text and outfile:
        with open(outfile, "w") as f:
            f.write(text)
        print(f"File downloaded: {outfile}")
    return text


def create_mkdocsblog_text(
    text: str,
    title: str = None,
    date_post: str = "2024-09-25",
    label: list[str] = ["Science"],
):
    """Create a blog text."""

    ### extract title if not provided
    if title is None:
        title_strs = [s for s in text.split("\n") if s.startswith("# ")]
        if not title_strs:
            title_strs = [s for s in text.split("\n") if s.startswith("## ")]
        elif not title_strs:
            title_strs = [s for s in text.split("\n") if s.startswith("### ")]

        if title_strs:
            title = title_strs[0].replace("#", "").strip()
        else:
            title = "no_title"

    ### make post
    header = f"---\ntitle: {title}\ndate: {date_post}\nauthors: [thangckt]\ncategories: {label}\ncomments: true\n---\n"
    blog_text = f"{header}\n {text}"

    ### make filename
    title_words = title.split()
    if len(title_words) > 5:
        title_words = title_words[:5]
    title_str = "_".join(title_words)
    filename = f"./_docs/blog/posts/{date_post}_{title_str}.md"

    ### write to file
    with open(filename, "w") as f:
        f.write(blog_text)
    return


def update_post(
    url: str,
    title: str = None,
    date_post: str = "2024-09-25",
    label: list[str] = ["Science"],
):
    text = download_rawtext(url)
    create_mkdocsblog_text(text, title, date_post, label)
    return


##### ANCHOR: udpate the blog posts
def main():
    ### Post 1
    update_post(
        url="https://raw.githubusercontent.com/JuDFTteam/best-of-atomistic-machine-learning/refs/heads/main/README.md",
        title="Best of Atomistic Machine Learning",
        date_post="2024-09-25",
        label=["Science", "ML", "Python"],
    )
    ### Post 2
    update_post(
        url="https://raw.githubusercontent.com/ml-tooling/best-of-python-dev/refs/heads/main/README.md",
        title="Best of Python Developer Tools",
        date_post="2024-09-28",
        label=["Python"],
    )
    ### Post 3
    update_post(
        url="https://raw.githubusercontent.com/ml-tooling/best-of-python/refs/heads/main/README.md",
        title="Best of Python",
        date_post="2024-09-30",
        label=["Python"],
    )
    ### Post 4
    update_post(
        url="https://raw.githubusercontent.com/vinta/awesome-python/refs/heads/master/README.md",
        title="Awesome Python",
        date_post="2024-09-20",
        label=["Python"],
    )
    ### Post 5
    update_post(
        url="https://raw.githubusercontent.com/Eipgen/Neural-Network-Models-for-Chemistry/refs/heads/main/README.md",
        title="Neural Network Models for Chemistry",
        date_post="2024-12-20",
        label=["Python", "ML"],
    )
    ### Post 6
    update_post(
        url="https://raw.githubusercontent.com/ml-tooling/best-of-ml-python/refs/heads/main/README.md",
        title="Best-of Machine Learning with Python",
        date_post="2025-01-20",
        label=["Python", "ML"],
    )
    return


if __name__ == "__main__":
    main()
