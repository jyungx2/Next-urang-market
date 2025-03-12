import Image from "next/image";
import classes from "./index.module.css";
import ImagePicker from "@/components/market/image-picker";
import { useRouter } from "next/router";

export default function PostPage() {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-[2rem] min-min-h-screen p-6 bg-[var(--color-bg)]">
      <header className={classes.header}>
        <button
          className="absolute top-0 left-0 cursor-pointer"
          onClick={() => router.push("/market")}
        >
          <Image src="/icons/xbtn.svg" alt="btn" height={30} width={30} />
        </button>
        <h1 className="font-bold text-[2.4rem] text-[var(--color-com-bg)]">
          New listing
        </h1>
      </header>

      <main className={classes.main}>
        <form className={classes.form}>
          <ImagePicker />
          {/* <div className={classes.cameraBox}>
            <label htmlFor="post-image">
              <input
                type="file"
                id="post-image"
                name="post-image"
                className={classes.fileInputCustom}
              />
              <Image
                src="/icons/camera.svg"
                alt="icon"
                width={26}
                height={26}
              />
            </label>
            <span className="text-[1.2rem]">0/10</span>
          </div> */}

          <div className={classes.inputBox}>
            <label htmlFor="name">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className={classes.inputCustom}
              placeholder="What are you selling or giving away?"
            />
          </div>
          <div className={classes.inputBox}>
            <label htmlFor="listing-type">Listing type</label>
            <div className={classes.btnCollection}>
              <button className={classes.button}>For Sale</button>
              <button className={classes.button}>Free</button>
            </div>

            <input
              type="text"
              id="listing-type"
              name="listing-type"
              className={classes.inputCustom}
              required
              placeholder="$ price"
            />
          </div>

          <div className={classes.inputBox}>
            <label htmlFor="description">Description</label>
            <textarea
              type="text"
              id="description"
              name="description"
              className={classes.inputCustom}
              rows="10"
              required
              placeholder="Tell us about your item e.g. brand, material, condition and size. Include anything that you think toue neighbors would like to know."
            ></textarea>
          </div>

          <div className={classes.inputBox}>
            <label htmlFor="instructions">Where to meet</label>
            <select
              id="where"
              name="where"
              required
              className={classes.inputCustom}
            >
              <option value="작전">작전동</option>
              <option value="서운">서운동</option>
            </select>
          </div>
          {/* <ImagePicker label="Your image" name="image" /> */}
          {/* {state.message && <p>{state.message}</p>} */}
          <div className={classes.actions}>{/* <MealsFormSubmit /> */}</div>
        </form>
      </main>
    </div>
  );
}
